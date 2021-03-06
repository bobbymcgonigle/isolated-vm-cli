let stdin = require('mock-stdin').stdin();
import child from 'child_process';
import assert from 'assert';
import { parseArgumentsToOptions, promptForMissingOptions } from '../src/cli';

function mockResponse(str) {
  // This function just sends some input to stdin, useful for testing cli

  stdin.send(str, "ascii");
  stdin.send("\x0D", "ascii"); // ascii value for Enter key
}

describe('Expected results from promptForMissingOptions()', function() {
  it('Ensure that printIsolateStats is prompted for, and correct answer taken from stdin'
    , async function() {
    const options = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: 128,
      timeout: 128,
      skipPrompts: false,
      printIsolateStats: undefined,
    };

    const expected = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: 128,
      timeout: 128,
      skipPrompts: false,
      printIsolateStats: "true",
    };

    let results = promptForMissingOptions(options);
    process.nextTick( function() {
        mockResponse("true");
    });

    return Promise.resolve(results).then( function(result) {
      assert.deepEqual(result, expected);
    });
  });
  
  it('Ensure that timeout is prompted for, and correct answer taken from stdin'
    , async function() {
    const options = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: 128,
      timeout: undefined,
      skipPrompts: false,
      printIsolateStats: true,
    };

    const expected = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: 128,
      timeout: "300",
      skipPrompts: false,
      printIsolateStats: true,
    };

    let results = promptForMissingOptions(options);
    process.nextTick( function() {
        mockResponse("300");
    });

    return Promise.resolve(results).then( function(result) {
      assert.deepEqual(result, expected);
    });
  });
  
  it('Ensure that isolateMemoryLimit is prompted for, and correct answer taken from stdin'
    , async function() {
    const options = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: undefined,
      timeout: 128,
      skipPrompts: false,
      printIsolateStats: true,
    };

    const expected = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: "128",
      timeout: 128,
      skipPrompts: false,
      printIsolateStats: true,
    };

    let results = promptForMissingOptions(options);
    process.nextTick( function() {
        mockResponse("128");
    });

    return Promise.resolve(results).then( function(result) {
      assert.deepEqual(result, expected);
    });
  });
});

describe('Expected results from parseArgumentsToOptions()', function() {
  it('./test and --skipPrompts only should leave certain values undefined', function() {
    const rawArgs = [
      '/usr/local/Cellar/node/15.4.0/bin/node',
      '/usr/local/bin/isolated-vm-cli',
      '--skipPrompts',
      '../test_files/test_input2.js'
    ];

    const expectedOutput = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: undefined,
      timeout: undefined,
      skipPrompts: true,
      printIsolateStats: undefined,
    };
    assert.deepEqual(parseArgumentsToOptions(rawArgs), expectedOutput);
  });

  it('./test --isolateMemoryLimit and --timeout', function() {
    const rawArgs = [
      '/usr/local/Cellar/node/15.4.0/bin/node',
      '/usr/local/bin/isolated-vm-cli',
      '--skipPrompts',
      '../test_files/test_input2.js',
      '--isolateMemoryLimit=18',
      '--timeout=18'
    ];
    
    const expectedOutput = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: 18,
      timeout: 18,
      skipPrompts: true,
      printIsolateStats: undefined,
    };
    assert.deepEqual(parseArgumentsToOptions(rawArgs), expectedOutput);
  });
  
  it('providing no script --printIsolateStats', function() {
    const rawArgs = [
      '/usr/local/Cellar/node/15.4.0/bin/node',
      '/usr/local/bin/isolated-vm-cli',
      '--isolateMemoryLimit=18',
      '--timeout=18',
      '--printIsolateStats',
    ];

    const expectedOutput = {
      scriptToRun: [],
      skipPrompts: undefined,
      isolateMemoryLimit: 18,
      timeout: 18,
      printIsolateStats: true,
    };
    assert.deepEqual(parseArgumentsToOptions(rawArgs), expectedOutput);
  });
});
