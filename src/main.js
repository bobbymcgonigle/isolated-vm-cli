let ivm = require('isolated-vm');
let fs = require('fs');
let path = require('path');
let chalk = require('chalk');

async function compileAndExecute(filename, isolateMemoryLimit, timeout) {
  // Function is responsible for compiling code, executing it in a new isolate
  // and returning what was logged to console as well as the most recently evaluated
  const logs = [];
  let code;
  try {
    code = fs.readFileSync(path.resolve("./",filename), {
      encoding: "UTF8"
    });
  } catch (err) {
    // We couldn't resolve the path to specified .js file
    return { filename, logs, result: err.stack };
  }

  // API info with explanation for below implementation
  // https://github.com/laverdet/isolated-vm#api-documentation
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
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
    { arguments: { reference: true } }
  );

  try {
    const script = await isolate.compileScript(code);
    const result = await script.run(context, {
      promise: true,
      timeout: timeout,
    });
    return { filename, logs, result };
  } catch (err) {
    return { filename, logs, result: err.stack };
  }
}

// TODO: add options for printing heapStats etc.
function printResult(result) {
  console.log("Filename: %s\nLogs: %s\nResult: %s\n", result.filename, result.logs.toString(), result.result);
}

export async function processScriptOptions(options) {
  // Function is responsible for what js files we're going to use from the
  // provided options and sets them up for compilation and execution.
  
  const outputs = [];
  if(options.runAllInDir) {
    // TODO: call some function that gets all .js files and then passes them each to compileAndExecute
  }
  else {
    // Attempt to run all scripts passed in cli
    for (const script of options.scriptToRun) {
      outputs.push(compileAndExecute(script, options.isolateMemoryLimit, options.timeout));
    }
  }

  // Print each result
  Promise.all(outputs).then(function(results) {
    results.forEach(result => printResult(result));
  }, function(err) {
    console.log(err);
  });
}

