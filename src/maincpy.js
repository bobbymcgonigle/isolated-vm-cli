import chalk from 'chalk';

let ivm = require('isolated-vm');
let fs = require('fs');

function makeIsolate() {
  let isolate = new ivm.Isolate({ memoryLimit: 16 });
  let context = isolate.createContextSync();
  let jail = context.global;
  jail.setSync('context', context);
  jail.setSync('isolate', isolate);
  jail.setSync('global', jail.derefInto());
  return { isolate, context, global };
}

function sum(min, max) {
	let sum = 0;
	for (let ii = min; ii < max; ++ii) {
		sum += ii;
	}
	return sum;
}

export async function runScriptInIsolate(options) {
  // I chose this number because it's big but also small enough that we don't go past JS's integer
  // limit.
  let num = Math.pow(2, 27);

  // First we execute a single thread run
  let start1 = new Date;
  let result = sum(0, num);
  console.log('Calculated '+ result+ ' in '+ (Date.now() - start1)+ 'ms');

  // Now we do the same thing over 4 threads
  let start2 = new Date;
  let ivm = require('isolated-vm');
  let numThreads = 4;
  let promises = Array(numThreads).fill().map(async function(_, ii) {

    // Set up 4 isolates with the `sum` function from above
    let isolate = new ivm.Isolate();
    let context = await isolate.createContext();
    let script = await isolate.compileScript(sum+ '');
    await script.run(context);
    let fnReference = await context.global.get('sum');

    // Run one slice of the sum loop
    let min = Math.floor(num / numThreads * ii);
    let max = Math.floor(num / numThreads * (ii + 1));
    return await fnReference.apply(undefined, [ min, max ]);
  });
  Promise.all(promises).then(function(sums) {
    let result = sums.reduce((a, b) => a + b, 0);
    console.log('Calculated '+ result+ ' in '+ (Date.now() - start2)+ 'ms');
  });
}
