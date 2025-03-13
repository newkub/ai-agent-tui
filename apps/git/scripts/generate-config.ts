import { defaultConfig } from '../src/types/config/defineConfig';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function generateConfig() {
  try {
    const configString = JSON.stringify(defaultConfig, null, 2);
    
    const configContent = `import { defineConfig } from './src/types/config/defineConfig';

export default defineConfig(${configString});`;
    
    const configPath = join(__dirname, '..', 'git-assistance.config.ts');
    
    await writeFile(configPath, configContent);
    console.log(`Config file generated successfully at: ${configPath}`);
  } catch (error) {
    console.error('Error generating config file:', error);
  }
}

generateConfig().catch((error) => {
  console.error('Failed to generate config:', error);
});
