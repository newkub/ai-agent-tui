import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { defaultConfig } from '../config/useAiConfig';

const configFilePath = join(__dirname, '../useai.config.ts');
const configDir = join(__dirname, '../config');
mkdirSync(configDir, { recursive: true });
writeFileSync(configFilePath, `import { defineConfig } from './config/useAiConfig';

export default defineConfig(${JSON.stringify(defaultConfig, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/:"([^"]+)"/g, ":'$1'")});
`);

console.log(`Generated configuration file at: ${configFilePath}`);