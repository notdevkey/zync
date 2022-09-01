#!/usr/bin/env node

import { program } from 'commander';
import inquirer, { QuestionCollection } from 'inquirer';
import { generate_greeting } from 'zync-cli';
import packagejson from './package.json';

const generateQuestions: QuestionCollection = [
  {
    type: 'list',
    name: 'language',
    message: 'Choose target',
    choices: ['Typescript', 'Prisma', 'Test'],
  },
  {
    type: 'input',
    name: 'path',
    message: 'Location',
  },
];

program.version(packagejson.version).description(packagejson.description);

program
  .command('generate')
  .alias('g')
  .description('Generate code based on schema')
  .action(async () => {
    const prompt = await inquirer.prompt(generateQuestions);

    if (!prompt.language || !prompt.path) return;
    console.log(generate_greeting('world'));
  });

program.parse(process.argv);
