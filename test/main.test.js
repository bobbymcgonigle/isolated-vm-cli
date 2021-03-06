import assert from 'assert';
import { compileAndExecute, printResult } from '../src/main'; 

describe('Expected results from compileAndExecute()', function() {
  it('Ensure we get an error in result when passing in non-existent filename/location', function() {
    return compileAndExecute("../test_files/i_do_not_exist.js", 1, 1 ).then(result => {
      assert.equal(result.result.includes('no such file or directory'), true);
    })
  });

  it('Ensure script times out when we pass --timeout=X', function() {
    return compileAndExecute("test_files/timeout.js", 1, 1 ).then(result => {
      assert.equal(result.result.includes('Script execution timed out'), true);
    });
  });
  
  it('Ensure empty file returns results undefined', function() {
    return compileAndExecute("test_files/empty.js", 1, 1 ).then(result => {
      assert.equal(result.result == null, true);
    })
  });

  it('Ensure logs and return value for sum.js match expected', function() {
    return compileAndExecute("test_files/sum.js", 128, 128 ).then(result => {
      const expectedLogs = [
            [ 'This script should succeed' ],
            [ 'This script should return the sum of 2 + 2' ]
      ];

      assert.equal(result.result, 4);
      assert.deepEqual(result.logs, expectedLogs);
    })
  });
});

describe('Expected results from printResult()', function() {
  it('Ensure that isolate stats are printed when --printIsolateStats is used', function() {
    // Example using test_input2.js
    const rawResult = {
      filename: '/test_files/sum.js',
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
    
    const consoleLogs = printResult(rawResult, true, true).toString();
    assert.equal(consoleLogs.includes('Cpu time:'), true);
    assert.equal(consoleLogs.includes('Wall time:'), true);
    assert.equal(consoleLogs.includes('Heap Stats:'), true);
  });
  
  it('Ensure that isolate stats are not printed when --printIsolateStats is not used', function() {
    // Example using test_input2.js
    const rawResult = {
      filename: '/test_files/sum.js.js',
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
    
    const consoleLogs = printResult(rawResult, false, true).toString();
    assert.equal(consoleLogs.includes('Cpu time:'), false);
    assert.equal(consoleLogs.includes('Wall time:'), false);
    assert.equal(consoleLogs.includes('Heap Stats:'), false);
  });
});
