import ivm from 'isolated-vm';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export async function compileAndExecute(filename, isolateMemoryLimit, timeout) {
  // Function is responsible for compiling code, executing it in a new isolate
  // and returning what was logged to console as well as the most recently evaluated
  
  const logs = [];
  let code;
  try {
    code = fs.readFileSync(path.resolve("./", filename), {
      encoding: "UTF8"
    });
  } catch (err) {
    // We couldn't resolve the path to specified .js file
    return { filename, logs, result: err.stack };
  }

  // API info with explanation for below implementation
  // https://github.com/laverdet/isolated-vm#api-documentation
  const isolate = new ivm.Isolate({ memoryLimit: isolateMemoryLimit });
  const context = await isolate.createContext();
  const jail = context.global;
  await jail.set("global", jail.derefInto());

  const logCallback = function(...args) {
    logs.push(args);
  }
  await context.evalClosure(
    `global.console.log = function(...args) {
        $0.applyIgnored(undefined, args, { arguments: { copy: true } });
    }`,
    [logCallback],
    { arguments: { reference: true }
    });

  let heapStats = {};
  let cpuTime = [];
  let wallTime = [];
  try {
    const script = await isolate.compileScript(code);
    const result = await script.run(context, {
      promise: true,
      timeout: timeout,
    });
    heapStats = isolate.getHeapStatisticsSync();
    cpuTime = isolate.cpuTime;
    wallTime = isolate.wallTime;
    return { filename, logs, result, heapStats, cpuTime, wallTime };
  } catch (err) {
    // Even if the js can't compile and run; still collect stats.
    heapStats = isolate.getHeapStatisticsSync();
    cpuTime = isolate.cpuTime;
    wallTime = isolate.wallTime;
    return { filename, logs, result: err.stack, heapStats, cpuTime, wallTime };
  }
}

export function printResult(result, printIsolateStats, debugMode) {
  // This function is responsible for printing results from each of the scripts we ran.
  
  // I'm confident there should be a better way to do this but...
  // This creates a hook for the console.log function so that anything logged is stored to
  // console.logs; I'm only using this to return logged data for unit testing in main.test.js where debugMode=true
  // will be used.
  // Console hook start.
  if(debugMode) {
    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function(){
      console.logs.push(Array.from(arguments));
    }
  }
  // Console hook end.

  console.log("Filename: %s\nLogs: %s\nResult: %s\n", result.filename, result.logs.toString(), result.result);
  
  if(printIsolateStats && result.cpuTime && result.wallTime) {
    // cpuTime and wallTime are in format [Seconds, NanoSeconds]: convert first to ns then to ms.
    const cpuInMil = (result.cpuTime[0]*1000000000 + result.cpuTime[1])/1000000;
    const wallInMil = (result.wallTime[0]*1000000000 + result.wallTime[1])/1000000;
    console.log("Heap Stats: %s\nCpu time: %s\nWall time: %s", result.heapStats, cpuInMil, wallInMil);
  }
  return console.logs;
}

export async function processScriptOptions(options) {
  // Function is responsible for what js files we're going to use from the
  // provided options and sets them up for compilation and execution.

  assert(options);
  const outputs = [];
  const timeout = parseInt(options.timeout, 10);
  options.scriptToRun.forEach(script => outputs.push(compileAndExecute(script, options.isolateMemoryLimit, timeout)));

  Promise.all(outputs).then(function(results) {
    results.forEach(result => printResult(result, options.printIsolateStats, false));
  }, function(err) {
    console.log(err);
  });
}
