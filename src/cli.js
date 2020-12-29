import arg from 'arg';
import inquirer from 'inquirer';
import { runScriptInIsolate } from './main';

function parseArgumentsToOptions(rawArgs) {
  const args = arg(
    {
       '--skipPrompts': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--skipPrompts'],
    scriptToRun: args._[0],
    isolateMemoryLimit: args._[1],
  }
}

async function promptForMissingOptions(options) {
  const defaultMemoryLimit = 128;
  if (options.skipPrompts) {
    return {
      ...options,
      isolateMemoryLimit: options.isolateMemoryLimit || defaultMemoryLimit,
    };
  }

  const questions = [];
  if(!options.isolateMemoryLimit) {
    questions.push({
      type: Number,
      name: 'isolateMemoryLimit',
      message: 'Specify memory limit',
      default: defaultMemoryLimit,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    isolateMemoryLimit: options.isolateMemoryLimit || answers.isolateMemoryLimit,
  };
}

export async function cli(args) {
  let options = parseArgumentsToOptions(args);
  options = await promptForMissingOptions(options);
  await runScriptInIsolate(options); 
  console.log(options);
}
