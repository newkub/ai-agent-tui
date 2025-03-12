import fzf from 'node-fzf';
import { text, outro } from '@clack/prompts';
import { readdir } from 'fs/promises';
import { stat } from 'fs/promises';
import path from 'path';

interface SearchOption {
  name: string;
  description: string;
}

async function listFilesAndFolders(directory: string) {
  const items = await readdir(directory);
  const results = await Promise.all(items.map(async item => {
    const itemPath = path.join(directory, item);
    const stats = await stat(itemPath);
    return {
      name: item,
      type: stats.isDirectory() ? 'folder' : 'file',
      path: itemPath
    };
  }));
  return results;
}

async function interactiveSearch(): Promise<void> {
  const options: SearchOption[] = [
    { name: '@file', description: 'Search files' },
    { name: '@folder', description: 'Search folders' }
  ];

  const searchStrings = options.map(option => option.name);
  const result = await fzf({ list: searchStrings });

  if (result?.selected) {
    const selectedOption = options.find(option => option.name === result.selected?.value);
    if (selectedOption) {
      const currentDir = process.cwd();
      const items = await listFilesAndFolders(currentDir);
      
      if (selectedOption.name === '@file') {
        const files = items.filter(item => item.type === 'file');
        const fileResult = await fzf({ 
          list: files.map(file => file.name)
        });
        
        if (fileResult?.selected) {
          const selectedFile = files.find(file => file.name === fileResult.selected?.value);
          if (selectedFile) {
            const action = await text({
              message: `What would you like to do with ${selectedFile.name}?`,
              placeholder: 'Enter your action'
            });
            
            if (typeof action === 'string') {
              outro(`Action "${action}" selected for file: ${selectedFile.path}`);
            }
          }
        }
      } else if (selectedOption.name === '@folder') {
        const folders = items.filter(item => item.type === 'folder');
        const folderResult = await fzf({ 
          list: folders.map(folder => folder.name)
        });
        
        if (folderResult?.selected) {
          const selectedFolder = folders.find(folder => folder.name === folderResult.selected?.value);
          if (selectedFolder) {
            const action = await text({
              message: `What would you like to do with ${selectedFolder.name}?`,
              placeholder: 'Enter your action'
            });
            
            if (typeof action === 'string') {
              outro(`Action "${action}" selected for folder: ${selectedFolder.path}`);
            }
          }
        }
      }
    }
  }
}

async function main() {
  await interactiveSearch();
}

main().catch(console.error);
