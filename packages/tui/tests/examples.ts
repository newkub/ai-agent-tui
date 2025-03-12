import { prompt } from '../src';

async function main() {
  const name = await prompt({
    type: 'input',
    name: 'name',
    message: 'What is your name?',
    required: true
  });

  console.log(`Hello, ${name}!`);
}

main().catch(console.error);
