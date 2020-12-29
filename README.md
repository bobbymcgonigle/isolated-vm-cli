# isolated-vm-cli
CLI to run Javascript files in isolated environments using the [isolated-vm](https://github.com/laverdet/isolated-vm) nodejs library.

## V8 and Isolates
Background for those not involved in the JS/Node world like me: V8 is Google's open source JavaScript engine. Isolates come from the V8 embedder's API. When you build around V8, we use the C++ interface V8 as a library which has the isolate class. Isolate represents an isolated instance of the V8 engine (i.e. a JavaScript execution environment). V8 isolates have completely separate states. Objects from one isolate must not be used in other isolates. When V8 is initialized a default isolate is implicitly created and entered. The embedder can create additional isolates and use them in parallel in multiple threads. [Reference](https://v8docs.nodesource.com/node-0.8/d5/dda/classv8_1_1_isolate.html)


isolated-vm is a library for nodejs which gives you access to v8's Isolate interface. This cli simply uses this nodejs library to run .js files in secure environments to safely run untrusted code etc.


