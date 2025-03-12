import { intro, select, outro } from '@clack/prompts';
import commit from './commands/commit';
import log from './commands/log';
import release from './commands/release';

async function main() {
  intro('AI-powered Git CLI assistant');

  const command = await select({
    message: 'Select a command',
    options: [
      { value: 'commit', label: 'Create a commit with AI assistance' },
      { value: 'log', label: 'View commit history with enhanced formatting' },
      { value: 'release', label: 'Create a new version release' }
    ]
  });

  switch (command) {
    case 'commit':
      await commit();
      break;
    case 'log':
      await log();
      break;
    case 'release':
      await release();
      break;
  }

  outro('Command completed!');
}

main();