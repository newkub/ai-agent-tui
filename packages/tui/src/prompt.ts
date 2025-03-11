import { createInterface } from 'readline';

interface PromptOptions {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  validate?: (value: string) => boolean | string;
}

interface SelectOptions<T extends string = string> {
  message: string;
  options: Array<{ value: T; label: string }>;
}

const CANCEL_SYMBOL = Symbol.for('cancel');

function isCancel(value: unknown): boolean {
  return value === CANCEL_SYMBOL;
}

function createPrompt<T>(handler: (rl: ReturnType<typeof createInterface>, resolve: (value: T | symbol) => void) => void): Promise<T | symbol> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    handler(rl, resolve);
  });
}

async function text(options: PromptOptions): Promise<string | symbol> {
  const { message, placeholder, defaultValue, validate } = options;
  
  return createPrompt<string>((rl, resolve) => {
    const prompt = `${message}${placeholder ? ` (${placeholder})` : ''}${defaultValue ? ` (${defaultValue})` : ''}: `;
    
    rl.question(prompt, async (answer) => {
      rl.close();
      
      if (answer.toLowerCase() === 'exit') {
        return resolve(CANCEL_SYMBOL);
      }
      
      const value = answer || defaultValue || '';
      
      if (validate) {
        const validation = validate(value);
        if (validation !== true && typeof validation === 'string') {
          console.log(`Error: ${validation}`);
          return resolve(await text(options));
        }
      }
      
      resolve(value);
    });
  });
}

async function select<T extends string = string>(options: SelectOptions<T>): Promise<T | symbol> {
  const { message, options: choices } = options;
  
  return createPrompt<T>((rl, resolve) => {
    console.log(`${message}`);
    choices.forEach((choice, index) => {
      console.log(`${index + 1}) ${choice.label}`);
    });
    
    rl.question('Enter selection: ', async (answer) => {
      rl.close();
      
      if (answer.toLowerCase() === 'exit') {
        return resolve(CANCEL_SYMBOL);
      }
      
      const index = Number.parseInt(answer, 10) - 1;
      if (Number.isNaN(index) || index < 0 || index >= choices.length) {
        console.log('Invalid selection. Please try again.');
        return resolve(await select(options));
      }
      
      resolve(choices[index].value);
    });
  });
}

async function multiselect<T extends string = string>(options: SelectOptions<T>): Promise<T[] | symbol> {
  const { message, options: choices } = options;
  
  return createPrompt<T[]>((rl, resolve) => {
    console.log(`${message} (comma-separated numbers, e.g. 1,3,4)`);
    choices.forEach((choice, index) => {
      console.log(`${index + 1}) ${choice.label}`);
    });
    
    rl.question('Enter selections: ', async (answer) => {
      rl.close();
      
      if (answer.toLowerCase() === 'exit') {
        return resolve(CANCEL_SYMBOL);
      }
      
      const selections = answer.split(',').map(s => s.trim());
      const selected: T[] = [];
      
      for (const selection of selections) {
        const index = Number.parseInt(selection, 10) - 1;
        if (Number.isNaN(index) || index < 0 || index >= choices.length) {
          console.log(`Invalid selection: ${selection}. Please try again.`);
          return resolve(await multiselect(options));
        }
        selected.push(choices[index].value);
      }
      
      resolve(selected);
    });
  });
}

async function main() {
  const result = await text({ message: 'Enter something' });
  if (!isCancel(result)) {
    // Process result
  }

  const value = await select({ 
    message: 'Select something', 
    options: [
      { value: 'option1', label: 'Option 1' }, 
      { value: 'option2', label: 'Option 2' }
    ] 
  });
  if (!isCancel(value)) {
    // Process value
  }

  const items = await multiselect({ 
    message: 'Select multiple things', 
    options: [
      { value: 'option1', label: 'Option 1' }, 
      { value: 'option2', label: 'Option 2' }
    ] 
  });
  if (!isCancel(items)) {
    // Process items
  }
}

main();

export { type PromptOptions, type SelectOptions, isCancel, text, select, multiselect };
