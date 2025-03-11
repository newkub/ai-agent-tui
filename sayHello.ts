import { text, isCancel } from '@clack/prompts';

async function main() {
  const name = await text({
    message: 'What is your name?',
    placeholder: 'Your name',
  });

  if (isCancel(name)) {
    console.log('Cancelled');
    return;
  }

  console.log(`Hello, ${name}!`);
}

main();
