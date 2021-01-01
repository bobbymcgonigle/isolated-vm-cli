const assert = require('chai').assert;
const expect = require('chai').expect;

import { parseArgumentsToOptions, promptForMissingOptions } from '../src/cli';

// TODO: figure out how to test that uses simulates prompt for stdin and stdout.
// Currently this test will always pass.
describe('Expected results from promptForMissingOptions()', function() {
  it('test', function() {
    });
    const options = {
      scriptToRun: [ '../test_files/test_input2.js' ],
      isolateMemoryLimit: undefined,
      timeout: undefined,
      skipPrompts: true,
      printIsolateStats: undefined,
      runAllInDir: undefined
    };
    promptForMissingOptions(options);
});

// Test that takes checks we receive the right options.
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
      runAllInDir: undefined
    };
    assert.deepEqual( parseArgumentsToOptions(rawArgs), expectedOutput );
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
      runAllInDir: undefined
    };
    assert.deepEqual( parseArgumentsToOptions(rawArgs), expectedOutput );
  });
  it('providing no script but passing --runAllInDir and --printIsolateStats', function() {
    const rawArgs = [
      '/usr/local/Cellar/node/15.4.0/bin/node',
      '/usr/local/bin/isolated-vm-cli',
      '--isolateMemoryLimit=18',
      '--timeout=18',
      '--printIsolateStats',
      '--runAllInDir'
    ];

    const expectedOutput = {
      scriptToRun: [],
      skipPrompts: undefined,
      isolateMemoryLimit: 18,
      timeout: 18,
      printIsolateStats: true,
      runAllInDir: true
    };
    assert.deepEqual( parseArgumentsToOptions(rawArgs), expectedOutput );
  });
});
