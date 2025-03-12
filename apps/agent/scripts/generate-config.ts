import { writeFileSync } from 'fs';
import { join } from 'path';
import { defaultConfig } from '../src/config/agentConfig';

const configFilePath = join(__dirname, '../agent.config.ts');
writeFileSync(configFilePath, `import type { DefaultConfig } from './src/config/agentConfig';

export const defaultConfig: DefaultConfig = ${JSON.stringify(defaultConfig, null, 2)};
`);

console.log(`Generated configuration file at: ${configFilePath}`);