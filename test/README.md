## npm run test

➜  isolated-vm-cli git:(main) ✗ npm run test

> @bobbymcgonigle/isolated-vm-cli@1.0.0 test
> mocha --require esm


  Expected results from parseArgumentsToOptions()
    ✓ ./test and --skipPrompts only should leave certain values undefined
    ✓ ./test --isolateMemoryLimit and --timeout
    ✓ providing no script --printIsolateStats

  Expected results from compileAndExecute()
    ✓ Ensure we get an error in result when passing in non-existent filename/location
    ✓ Ensure script times out when we pass --timeout=X

  Expected results from printResult()
    ✓ Make sure that isolate stats are printed when --printIsolateStats is used
    ✓ Make sure that isolate stats are not printed when --printIsolateStats is not used


  8 passing (15ms)
