import { color } from './color';
import type { InputOptions } from '../types/prompt';
import { createInterface } from 'readline';

const colorize = {
  blue: (message: string) => color.blue(message),
  green: (message: string) => color.green(message),
  red: (message: string) => color.red(message),
  yellow: (message: string) => color.yellow(message)
};

function createReadlineInterface() {
  return createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

async function input(options: InputOptions) {
  const { message, initial = '', validate } = options;
  process.stdout.write(`${colorize.blue('?')} ${message}: `);
  
  const rl = createReadlineInterface();
  
  return new Promise<string>((resolve) => {
    rl.question('', (answer) => {
      const value = answer || initial;
      
      if (validate) {
        const result = validate(value);
        if (result !== true) {
          console.log(colorize.red(typeof result === 'string' ? result : 'Invalid input'));
          rl.close();
          resolve(input(options));
          return;
        }
      }
      
      rl.close();
      resolve(value);
    });
  });
}

async function confirm(message: string, initial = false): Promise<boolean> {
  process.stdout.write(`${colorize.blue('?')} ${message} ${initial ? '(Y/n)' : '(y/N)'}: `);
  
  const rl = createReadlineInterface();
  
  return new Promise<boolean>((resolve) => {
    rl.question('', (answer) => {
      const normalized = answer.toLowerCase().trim();
      
      if (normalized === '') {
        rl.close();
        resolve(initial);
        return;
      }
      
      const value = normalized === 'y' || normalized === 'yes';
      rl.close();
      resolve(value);
    });
  });
}

async function select<T extends string>(message: string, choices: T[]): Promise<T> {
  console.log(`${colorize.blue('?')} ${message}:`);
  
  const rl = createReadlineInterface();
  
  choices.forEach((choice, i) => {
    console.log(`  ${i + 1}) ${choice}`);
  });
  
  process.stdout.write(`Enter number (1-${choices.length}): `);
  
  return new Promise<T>((resolve) => {
    rl.question('', (answer) => {
      const index = Number.parseInt(answer, 10) - 1;
      
      if (Number.isNaN(index) || index < 0 || index >= choices.length) {
        console.log(colorize.red('Invalid selection'));
        rl.close();
        resolve(select(message, choices));
        return;
      }
      
      rl.close();
      resolve(choices[index]);
    });
  });
}

async function multiselect<T extends string>(message: string, choices: T[]): Promise<T[]> {
  const selected = new Set<number>();
  let currentIndex = 0;
  
  const renderChoices = () => {
    console.clear();
    console.log(`${colorize.blue('?')} ${message} (space to select, enter when done):`);
    
    choices.forEach((choice, i) => {
      const prefix = selected.has(i) ? colorize.green('✓') : ' ';
      const indicator = i === currentIndex ? colorize.blue('›') : ' ';
      console.log(`  ${indicator} ${prefix} ${choice}`);
    });
  };
  
  renderChoices();
  
  return new Promise<T[]>((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    const keyHandler = (key: Buffer) => {
      const str = key.toString();
      
      if (str === '\r' || str === '\n') {
        cleanup();
        console.log('');
        resolve(choices.filter((_, i) => selected.has(i)));
      } else if (str === ' ') {
        toggleSelection();
        renderChoices();
      } else if (str === '\u001b[A' || str === 'k') {
        moveSelection(-1);
        renderChoices();
      } else if (str === '\u001b[B' || str === 'j') {
        moveSelection(1);
        renderChoices();
      } else if (str === '\u0003') {
        process.exit(0);
      }
    };
    
    const toggleSelection = () => {
      if (selected.has(currentIndex)) {
        selected.delete(currentIndex);
      } else {
        selected.add(currentIndex);
      }
    };
    
    const moveSelection = (direction: number) => {
      currentIndex = (currentIndex + direction + choices.length) % choices.length;
    };
    
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', keyHandler);
    };
    
    process.stdin.on('data', keyHandler);
  });
}
