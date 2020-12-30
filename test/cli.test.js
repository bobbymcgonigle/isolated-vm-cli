const assert = require('chai').assert;
import { parseArgumentsToOptions } from '../src/cli';

// Test that takes checks we receive the right options
describe('parseArgumentsToOptions', function() {
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
        runAllInDir: undefined
    };
    assert.deepEqual( parseArgumentsToOptions(rawArgs), expectedOutput );
   });
});

