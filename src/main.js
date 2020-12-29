let ivm = require('isolated-vm');
let fs = require('fs');

async function compileAndExecute(filename, memoryLimit, logs) {
  // Function is responsible for compiling code, executing it in a new isolate
  // and returning what was logged to console as well as the most recently evaluated
  // <replace>

  const code = fs.readFileSync(__dirname + "/" + filename, {
    encoding: "UTF8"
  });

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
      timeout: 150000,
    });
    console.log(logs);
    return { logs, result };
  } catch (err) {
    return { logs, result: err.stack };
  }
}

export async function runScriptInIsolate(options) {
  const logs = [];
  logs.push( await compileAndExecute("test.js", 16, logs) );
  console.log(logs);
}
