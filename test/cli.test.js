import assert from 'assert';
import { parseArgumentsToOptions, promptForMissingOptions } from '../src/cli';

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
    };
    assert.deepEqual( parseArgumentsToOptions(rawArgs), expectedOutput );
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
    assert.deepEqual( parseArgumentsToOptions(rawArgs), expectedOutput );
  });
});
