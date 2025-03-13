import { defaultConfig } from './types/defineConfig';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { cliui } from '@poppinss/cliui';
import pc from 'picocolors';
import { intro, select } from '@clack/prompts';
import commit from './commands/commit';
import log from './commands/log';
import release from './commands/release';

async function generateConfig(): Promise<string> {
  const configPath = join(__dirname, '..', 'git-assistance.config.ts');
  
  try {
    const configString = JSON.stringify(defaultConfig, null, 2);
    const configContent = `import { defineConfig } from './src/types/defineConfig';

export default defineConfig(${configString});`;
    
    await writeFile(configPath, configContent);
    return configPath;
  } catch (error) {
    console.error('Error generating config file:', error);
    throw error;
  }
}

function displaySuccess(configPath: string) {
  const ui = cliui();
  const sticker = ui.sticker();

  sticker
    .add('Started HTTP server')
    .add('')
    .add(`Config file: ${pc.cyan(configPath)}`)
    .add(`Local address:    ${pc.cyan('http://localhost:3333')}`)
    .add(`Network address:  ${pc.cyan('http://192.168.1.2:3333')}`)
    .render();
}

async function configExists(): Promise<boolean> {
  const configPaths = [
    join(process.cwd(), 'git-assistance.config.ts'),
    join(homedir(), '.git-assistance', 'git-assistance.config.ts')
  ];
  
  return configPaths.some(path => existsSync(path));
}

async function main(): Promise<void> {
  try {
    const configPath = await generateConfig();
    if (await configExists()) {
      displaySuccess(configPath);
    }

    intro('Git Assistance');

    const command = await select({
      message: 'Select a command',
      options: [
        { value: 'commit', label: 'Commit' },
        { value: 'log', label: 'Log' },
        { value: 'release', label: 'Release' }
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
  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

main();
