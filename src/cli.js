import arg from 'arg';
import inquirer from 'inquirer';
import { processScriptOptions } from './main';
import path from 'path';

export function parseArgumentsToOptions(rawArgs) {
  // Take our raw arguments and process them into options.
  
  const args = arg(
    {
       '--isolateMemoryLimit': Number, 
       '--timeout': Number,
       '--skipPrompts': Boolean,
       '--printIsolateStats': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    scriptToRun: args._,
    isolateMemoryLimit: args['--isolateMemoryLimit'],
    timeout: args['--timeout'],
    skipPrompts: args['--skipPrompts'],
    printIsolateStats: args['--printIsolateStats'],
  }
}

export async function promptForMissingOptions(options) {
  // Function prompts the user for different options.
  // skipped when --skipPrompts is specified in cli and we use default values for 
  // options not specified.

  // Default value for both timeout and memory if not specified and skipping prompts.
  const defaultValue = 128;
  if (options.skipPrompts) {
    return {
      ...options,
      isolateMemoryLimit: options.isolateMemoryLimit || defaultValue,
      timeout: options.timeout || defaultValue,
    };
  }

  // --skipPrompts not used; ask questions.
  const questions = [];
  
  if(!options.scriptToRun) {
    questions.push({
      type: String,
      name: 'scriptToRun',
      message: 'Specify file to run',
      default: null, 
    });
  }

  if(!options.isolateMemoryLimit) {
    questions.push({
      type: Number,
      name: 'isolateMemoryLimit',
      message: 'Specify memory limit',
      default: defaultValue,
    });
  }
  
  if(!options.timeout) {
    questions.push({
      type: Number,
      name: 'timeout',
      message: 'Specify timeout limit',
      default: defaultValue,
    });
  }
  
  if(!options.printIsolateStats) {
    questions.push({
      type: Boolean,
      name: 'printIsolateStats',
      message: 'Print isolate Statistics',
    });
  }

  // Actually ask the questions using inquirer.
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    scriptToRun: options.scriptToRun || answers.scriptToRun,
    isolateMemoryLimit: options.isolateMemoryLimit || answers.isolateMemoryLimit,
    timeout: options.timeout || answers.timeout,
    printIsolateStats: options.printIsolateStats || answers.printIsolateStats,
  };
}

export async function cli(args) {
  // Main function in the cli; Responsible for parsing raw arguments,
  // prompting for more information if neccesary and then running the script.

  let options = parseArgumentsToOptions(args);
  options = await promptForMissingOptions(options);
  processScriptOptions(options); 
}
