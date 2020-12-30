# isolated-vm-cli
CLI to run Javascript files in isolated environments using the [isolated-vm](https://github.com/laverdet/isolated-vm) nodejs library.

## V8 and Isolates
Background for those not involved in the JS/Node world (Which I'm not): V8 is Google's open source JavaScript engine and Isolates come from the V8 embedder's API. When you build around V8, we use the C++ interface V8 as a library which actually has the isolate class. Each Isolate represents an isolated instance of the V8 engine (i.e. a JavaScript execution environment). They have completely separate states and objects from one isolate must not be used in other isolates. When V8 is initialized a default isolate is implicitly created and entered. The embedder can create additional isolates and use them in parallel in multiple threads. [Reference](https://v8docs.nodesource.com/node-0.8/d5/dda/classv8_1_1_isolate.html)


isolated-vm is a library for nodejs which gives you access to v8's Isolate interface. This cli simply uses this nodejs library to run .js files in secure environments to safely run untrusted code etc.

## Example Usage
test_input1.js
```
console.log("This ; should give us a syntax error";)
let foo = 1; let bar = 2;
bar = foo + bar;
```
test_input2.js
```
console.log("This script should have two log entries");
console.log("This script should succeed and return 3.");
let foo = 1; let bar = 2;
bar = foo + bar;
```
Example using --skipPrompts:
```
isolated-vm-cli test_input1.js test_input2.js --skipPrompts

Filename: test_input1.js
Logs:
Result: SyntaxError: missing ) after argument list [<isolated-vm>:1:13]
    at (<isolated-vm boundary>)
    at compileAndExecute (/Users/bobbymcgonigle/isolated-vm-cli/src/main.js:39:34)

Filename: test_input2.js
Logs: This script should have two log entries,This script should succeed and return 3.
Result: 3
```
