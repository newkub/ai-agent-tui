import { defaultConfig } from '../src/git-ai-assistance.config.ts';
import { format } from 'prettier';
import { join } from 'path';
import { homedir } from 'os';
import { promises as fs } from 'fs';
import { cliui } from '@poppinss/cliui';
import colors from 'picocolors';

// Define config paths - one in home directory and one in current project
const HOME_CONFIG_DIR = join(homedir(), '.git-ai-assistance');
const PROJECT_CONFIG_DIR = join(__dirname, '..'); 
const ui = cliui();
const sticker = ui.sticker();

async function generateConfig() {
  try {
    // Create a deep copy of the default config
    const configCopy = JSON.parse(JSON.stringify(defaultConfig));
    

    
    // Convert config to string
    const configString = JSON.stringify(configCopy, null, 2);
    
    const configContent = `import type { AicommitConfig } from './src/git-ai-assistance.config';

export default ${configString} as AicommitConfig;
`;

    const formatted = await format(configContent, {
      parser: 'typescript',
      printWidth: 80,
      useTabs: false,
      tabWidth: 2
    });

    const projectConfigPath = join(PROJECT_CONFIG_DIR, 'git-ai-assistance.config.ts');
    const homeConfigPath = join(HOME_CONFIG_DIR, 'git-ai-assistance.config.ts');

    try {
      await fs.access(HOME_CONFIG_DIR);
 
    } catch {
      await fs.mkdir(HOME_CONFIG_DIR, { recursive: true });

    }

    try {
      await fs.access(projectConfigPath);

    } catch {
      await fs.writeFile(projectConfigPath, formatted);

    }

    try {
      await fs.access(homeConfigPath);

    } catch {
      await fs.writeFile(homeConfigPath, formatted);

    }
    
    try {
      sticker
        .add('Configuration generated successfully')
        .add('')
        .add(`Config location (project): ${colors.cyan(projectConfigPath)}`)
        .add(`Config location (home): ${colors.cyan(homeConfigPath)}`)
        .render();
    } catch (error) {
      console.error('Failed to display success message:', error);
    }
  } catch (error) {
    console.error('Failed to generate config:', error);
  }
}

generateConfig().catch((error) => {
  console.error('Failed to generate config:', error);
});
