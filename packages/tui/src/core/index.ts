// Scan and export all modules from the core directory
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all TypeScript files in the current directory
const files = fs.readdirSync(__dirname).filter(file => 
  file.endsWith('.ts') && file !== 'index.ts'
);

// Export all files except the current index.ts
for (const file of files) {
  const moduleName = file.replace('.ts', '');
  const modulePath = `./${moduleName}`;
  import(modulePath).then(module => {
    Object.assign(exports, { [moduleName]: module });
  });
}