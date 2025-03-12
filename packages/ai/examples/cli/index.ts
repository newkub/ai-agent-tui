import { intro, select, outro } from '@clack/prompts';
import { spawnSync } from 'node:child_process';

async function main() {
  intro('Select test to run');

  const testFile = await select({
    message: 'Which test would you like to run?',
    options: [
      { value: 'deepseek.ts', label: 'Deepseek Test' },
    ]
  });

  if (typeof testFile !== 'string') {
    outro('Test selection cancelled');
    process.exit(0);
  }

  const result = spawnSync('bun', ['run', `${__dirname}/${testFile}`], {
    stdio: 'inherit'
  });

  process.exit(result.status ?? 0);
}

main();