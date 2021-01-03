## npm run test
```
➜  isolated-vm-cli git:(main) ✗ npm run test

> @bobbymcgonigle/isolated-vm-cli@1.0.0 test
> mocha --require esm



  Expected results from promptForMissingOptions()
    ✓ Ensure that printIsolateStats is prompted for, and correct answer taken from stdin
    ✓ Ensure that timeout is prompted for, and correct answer taken from stdin
    ✓ Ensure that isolateMemoryLimit is prompted for, and correct answer taken from stdin

  Expected results from parseArgumentsToOptions()
    ✓ ./test and --skipPrompts only should leave certain values undefined
    ✓ ./test --isolateMemoryLimit and --timeout
    ✓ providing no script --printIsolateStats

  Expected results from compileAndExecute()
    ✓ Ensure we get an error in result when passing in non-existent filename/location
    ✓ Ensure script times out when we pass --timeout=X
    ✓ Ensure empty file returns results undefined
    ✓ Ensure logs and return value for sum.js match expected

  Expected results from printResult()
    ✓ Ensure that isolate stats are printed when --printIsolateStats is used
    ✓ Ensure that isolate stats are not printed when --printIsolateStats is not used


  12 passing (43ms)
```
