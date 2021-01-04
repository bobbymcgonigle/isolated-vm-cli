# isolated-vm-cli
CLI to run Javascript files in isolated environments using the [isolated-vm](https://github.com/laverdet/isolated-vm) nodejs library.

## V8 and Isolates
Background for those not involved in the JS/Node world (Which I'm not): V8 is Google's open source JavaScript engine and Isolates come from the V8 embedder's API. When you build around V8, we use the C++ interface V8 as a library which actually has the isolate class. Each Isolate represents an isolated instance of the V8 engine (i.e. a JavaScript execution environment). They have completely separate states and objects from one isolate must not be used in other isolates. When V8 is initialized a default isolate is implicitly created and entered. The embedder can create additional isolates and use them in parallel in multiple threads. [Reference](https://v8docs.nodesource.com/node-0.8/d5/dda/classv8_1_1_isolate.html)


isolated-vm is a library for nodejs which gives you access to v8's Isolate interface. This cli simply uses this nodejs library to run .js files in secure environments to safely run untrusted code etc.

## Requirements
The requirements are to install [isolated-vm](https://github.com/laverdet/isolated-vm) and its requirements. The requirements copied from isolated-vm readme are:

This project requires nodejs LTS version 10.4.0 (or later).

Furthermore, to install this module you will need a compiler installed. If you run into errors while running npm install isolated-vm it is likely you don't have a compiler set up, or your compiler is too old.

- Windows + OS X users should follow the instuctions here: node-gyp
- Ubuntu users should run: `sudo apt-get install python g++ build-essential`
- Alpine users should run: `sudo apk add python make g++`
- Amazon Linux AMI users should run: `sudo yum install gcc72 gcc72-c++`
- Arch Linux users should run: `sudo pacman -S make gcc python`


## Parameters
To compile and run a Javascript file use the syntax `isolated-vim-cli <list-of-file-locations> <--optional-parameters>`. If `--skipPrompts` is not specified the cli will prompt you to provide a value for missing parameters.
|   Parameter            |Type                          |Explanation                     | --skipPrompts Default Value|
|----------------|-------------------------------|-----------------------------|-----------------------------|
|--skipPrompts| Boolean| Don't prompt for more info; use default values |false |
|--isolateMemoryLimit=| Number| Memory limit that this isolate may use, in MB. Note that this is more of a guideline instead of a strict limit. A determined attacker could use 2-3 times this limit before their script is terminated.| 128|
|--timeout=| Number|Maximum amount of time in milliseconds this script is allowed to run before execution is canceled. Default is no timeout.|128|
|--printIsolateStats|Boolean|Choose to print stats about each isolate after script is finished running; shows heap statistics, cpu time and wall time.| false|

## Example Usage
sum.js
```
function sum(number1, number2) {
  return number1 + number2;
}

console.log("This script should succeed");
console.log("This script should return the sum of 2 + 2");
let foo = 2; let bar = 2;
bar = sum(foo, bar);
```
syntax_error.js
```
console.log("This ; should give us a syntax error";)
let foo = 1; let bar = 2;
bar = foo + bar;
```
Example running the two scripts:
```
➜  test_files git:(main) ✗ isolated-vm-cli sum.js syntax_error.js
? Specify memory limit 128
? Specify timeout limit 128
? Print isolate Statistics y

Filename: sum.js
Logs: This script should succeed,This script should return the sum of 2 + 2
Result: 4

Heap Stats: {
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
}
Cpu time: 1.06494
Wall time: 1.110118


Filename: syntax_error.js
Logs:
Result: SyntaxError: missing ) after argument list [<isolated-vm>:2:13]
    at (<isolated-vm boundary>)
    at compileAndExecute (/Users/bobbymcgonigle/isolated-vm-cli/src/main.js:46:34)

Heap Stats: {
  total_heap_size: 1916928,
  total_heap_size_executable: 262144,
  total_physical_size: 692664,
  total_available_size: 137464064,
  used_heap_size: 866280,
  heap_size_limit: 137363456,
  malloced_memory: 24672,
  peak_malloced_memory: 24576,
  does_zap_garbage: 0,
  externally_allocated_size: 0
}
Cpu time: 0.891083
Wall time: 0.929364
➜  test_files git:(main) ✗
```



Example using --skipPrompts:
```
➜  test_files git:(main) ✗ isolated-vm-cli sum.js syntax_error.js --skipPrompts

Filename: sum.js
Logs: This script should succeed,This script should return the sum of 2 + 2
Result: 4

Filename: syntax_error.js
Logs:
Result: SyntaxError: missing ) after argument list [<isolated-vm>:2:13]
    at (<isolated-vm boundary>)
    at compileAndExecute (/Users/bobbymcgonigle/isolated-vm-cli/src/main.js:47:34)
```
