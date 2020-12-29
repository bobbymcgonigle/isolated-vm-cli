let ivm = require('isolated-vm');
let fs = require('fs');
let path = require('path');
let chalk = require('chalk');

async function compileAndExecute(filename, isolateMemoryLimit, timeout, logs) {
  // Function is responsible for compiling code, executing it in a new isolate
  // and returning what was logged to console as well as the most recently evaluated

  try {
    const code = fs.readFileSync(path.resolve("./",filename), {
      encoding: "UTF8"
    });
  } catch (error) {
    // We couldn't resolve the path to specified .js file
    console.log('%s could not resolve file %s', chalk.bold.red("Error:"), chalk.underline.blue(filename));
    process.exit();
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
    return { logs, result };
  } catch (err) {
    return { logs, result: err.stack };
  }
}

export async function processScriptOptions(options) {
  // Function is responsible for what js files we're going to use from the
  // provided options and sets them up for compilation and execution.

  console.log(options);
  const logs = [];
  await compileAndExecute(options.scriptToRun, options.isolateMemoryLimit, options.timeout, logs);
  console.log("%s compiled and ran %s in an insolated environment.", chalk.bold.green("Success:"), options.scriptToRun);
}
