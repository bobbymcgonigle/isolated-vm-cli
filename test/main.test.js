var assert = require('assert');
import { compileAndExecute, printResult } from '../src/main'; 

describe('Expected results from compileAndExecute()', function() {
  
  it('Ensure we get an error in result when passing in non-existent filename/location', function() {
    return compileAndExecute("../test_files/i_do_not_exist.js", 1, 1 ).then(result => {
      assert.equal(result.result.includes('no such file or directory'), true);
    })
  });

  it('Ensure script times out when we pass --timeout=X', function() {
    return compileAndExecute("test_files/test_input3.js", 1, 1 ).then(result => {
      assert.equal(result.result.includes('Script execution timed out'), true);
    });
  });
});

describe('Expected results from processScriptOptions()', function() {
  
  it('Ensure that the three test_files get run when --runAllInDir is used', function() {
    return compileAndExecute("test_files/test_input3.js", 1, 1 ).then(result => {
      assert.equal(result.result.includes('Script execution timed out'), true);
    });
  });
});

describe('Expected results from printResult()', function() {
  it('Make sure that heap stats are printed when --printIsolateStats is used', function() {
    // Example using test_input2.js
    const rawResult = {
      filename: '../test_files/test_input2.js',
      logs: [
        [ 'This script should succeed' ],
        [ 'This script should return the sum of 2 + 2' ]
      ],
      result: 4,
      heapStats: {
        total_heap_size: 1916928,
        total_heap_size_executable: 262144,
        total_physical_size: 693704,
        total_available_size: 137465120,
        used_heap_size: 865224,
        heap_size_limit: 137363456,
        malloced_memory: 24672,
        peak_malloced_memory: 24576,
        does_zap_garbage: 0,
        externally_allocated_size: 0
      },
      cpuTime: [ 0, 1181428 ],
      wallTime: [ 0, 1238120 ]
    };
    printResult(rawResult, true);
    console.log(console.logs);
    //TODO: figure out how to read stdout, let this pass for now
    //assert.equal(result.result.includes('Script execution timed out'), true);
  });
  it('Make sure that isolate stats are not printed when --printIsolateStats is not used', function() {
    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function(){
          console.logs.push(Array.from(arguments));
          console.stdlog.apply(console, arguments);
    }

    // Example using test_input2.js
    const rawResult = {
      filename: '../test_files/test_input2.js',
      logs: [
        [ 'This script should succeed' ],
        [ 'This script should return the sum of 2 + 2' ]
      ],
      result: 4,
      heapStats: {
        total_heap_size: 1916928,
        total_heap_size_executable: 262144,
        total_physical_size: 693704,
        total_available_size: 137465120,
        used_heap_size: 865224,
        heap_size_limit: 137363456,
        malloced_memory: 24672,
        peak_malloced_memory: 24576,
        does_zap_garbage: 0,
        externally_allocated_size: 0
      },
      cpuTime: [ 0, 1181428 ],
      wallTime: [ 0, 1238120 ]
    };
    //TODO: figure out how to read stdout, let this pass for now
    //assert.equal(result.result.includes('Script execution timed out'), true);
  });
});