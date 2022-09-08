import { program } from 'commander';
import inquirer, { QuestionCollection } from 'inquirer';

const questions: QuestionCollection = [
  {
    type: 'list',
    name: 'language',
    message: 'Choose language',
    choices: ['Prisma', 'Typescript'],
  },
];

program.version('0.1.0').description('Zync cli');

program
  .command('generate')
  .alias('g')
  .description('Generate code based on schema')
  .action(async () => {
    inquirer.prompt(questions);
    console.log('Hello world');
  });

program.parse(process.argv);
