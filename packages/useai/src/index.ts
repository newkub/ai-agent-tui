export * from './providers/openai';
export * from './providers/anthropic';
export * from './providers/gemini';
export * from './tools/autocomplete';
export * from './tools/image';
export * from './tools/search';

// Automatically export all modules from tools directory
import fs from 'fs';
import path from 'path';

// Get all files from tools directory
const toolsDir = path.join(__dirname, 'tools');
const toolFiles = fs.readdirSync(toolsDir)
  .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
  .filter(file => !file.endsWith('.d.ts'))
  .map(file => `./tools/${path.basename(file, path.extname(file))}`);

// Re-export all tools
for (const file of toolFiles) {
  require(file);
}