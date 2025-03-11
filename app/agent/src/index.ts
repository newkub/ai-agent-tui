import { select, isCancel, multiselect, text } from '@clack/prompts';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🤖 Welcome to the AI Coding Assistant!\n');

  const action = await select({
    message: 'What would you like to do?',
    options: [
      { 
        value: 'edit', 
        label: '💉 Edit           Create and modify content with ease', 
      },
      { 
        value: 'explan', 
        label: '📚 Explanation    Deep dive into features and concepts', 
      },
      { 
        value: 'fix', 
        label: '⚡ Fix            Resolve issues and optimize performance', 
      },
      { 
        value: 'explane', 
        label: '🔍 Explane        Explore practical use cases', 
      },
      { 
        value: 'research', 
        label: '🔬 Research       Gather information and analyze data', 
      },
    ],
  });

  if (isCancel(action)) {
    console.log('Cancelled');
    return;
  }

  switch (action) {
    case 'edit':
      await handleEdit();
      break;
    case 'explan':
      await handleExplanation();
      break;
    case 'fix':
      await handleFix();
      break;
    case 'explane':
      await handleExample();
      break;
    case 'research':
      await handleResearch();
      break;
  }
}

async function getFiles(dir = '.'): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and .git directories
      if (entry.name === 'node_modules' || entry.name === '.git') {
        return [];
      }
      return getFiles(fullPath);
    }
    return fullPath;
  }));
  return files.flat();
}

async function selectFiles(promptText: string): Promise<string[] | undefined> {
  const files = await getFiles();
  const selected = await multiselect({
    message: promptText,
    options: files.map(file => ({ value: file, label: file })),
  });
  if (isCancel(selected)) return undefined;
  return selected as string[];
}

async function handleEdit() {
  const selectedFiles = await selectFiles('Select files to edit (use TAB to select multiple):');
  if (!selectedFiles?.length) return;

  const userPrompt = await text({
    message: 'Please enter your edit prompt:',
  });
  
  if (isCancel(userPrompt)) return;

  for (const file of selectedFiles) {
    const explanation = generateExplanation(file, userPrompt);
    console.log(`\nEdit explanation for ${file}:\n${explanation}`);
  }
}

function generateExplanation(file: string, prompt: string): string {
  // AI logic to generate explanation
  return `Explanation for ${file} based on prompt: ${prompt}`;
}

async function handleExplanation() {
  const selectedFiles = await selectFiles('Select files to explain (use TAB to select multiple):');
  if (!selectedFiles?.length) return;

  const userPrompt = await text({
    message: 'What aspects would you like explained?',
  });
  
  if (isCancel(userPrompt)) return;

  for (const file of selectedFiles) {
    const explanation = generateExplanation(file, userPrompt as string);
    console.log(`\nExplanation for ${file}:\n${explanation}`);
  }
}

async function handleFix() {
  const selectedFiles = await selectFiles('Select files to fix (use TAB to select multiple):');
  if (!selectedFiles?.length) return;

  const userPrompt = await text({
    message: 'Please describe the issue to fix:',
  });
  
  if (isCancel(userPrompt)) return;

  for (const file of selectedFiles) {
    const explanation = generateExplanation(file, userPrompt as string);
    console.log(`\nFix for ${file}:\n${explanation}`);
  }
}

async function handleExample() {
  const selectedFiles = await selectFiles('Select files to explain with examples (use TAB to select multiple):');
  if (!selectedFiles?.length) return;

  const userPrompt = await text({
    message: 'What kind of examples would you like?',
  });
  
  if (isCancel(userPrompt)) return;

  for (const file of selectedFiles) {
    const explanation = generateExplanation(file, userPrompt as string);
    console.log(`\nExamples for ${file}:\n${explanation}`);
  }
}

async function handleResearch() {
  const selectedFiles = await selectFiles('Select files to research (use TAB to select multiple):');
  if (!selectedFiles?.length) return;

  const userPrompt = await text({
    message: 'What research questions do you have?',
  });
  
  if (isCancel(userPrompt)) return;

  for (const file of selectedFiles) {
    const explanation = generateExplanation(file, userPrompt as string);
    console.log(`\nResearch for ${file}:\n${explanation}`);
  }
}

main();