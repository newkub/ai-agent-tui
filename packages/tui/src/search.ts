import { createInterface } from 'readline';
import { fg, style } from './color';

interface SearchOptions {
  prompt?: string;
  items: string[];
  height?: number;
  fuzzy?: boolean;
  highlightMatches?: boolean;
}

function search(options: SearchOptions): Promise<string | null> {
  const { 
    prompt = 'Search: ',
    items = [],
    height = 10,
    fuzzy = true,
    highlightMatches = true
  } = options;

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let query = '';
    let selectedIndex = 0;
    let filteredItems: string[] = [...items];

    // Hide cursor
    const output = '\x1B[?25l';
    process.stdout.write(typeof output === 'string' ? output : Buffer.from(output));

    const render = () => {
      // Clear previous render and reset cursor position
      const clearOutput = '\x1B[J';
      process.stdout.write(typeof clearOutput === 'string' ? clearOutput : Buffer.from(clearOutput));
      
      // Show prompt with query
      process.stdout.write(`${prompt}${query}\n`);
      
      // Filter items based on query
      filteredItems = naive_linechunk(items, query, fuzzy);
      
      // Display filtered items with pagination
      const displayItems = filteredItems.slice(0, height);
      
      displayItems.forEach((item, index) => {
        const isSelected = index === selectedIndex;
        const displayItem = highlightMatches && query 
          ? highlightMatch(item, query) 
          : item;
        
        const output = (isSelected 
          ? style(fg('cyan'), `> ${displayItem}\n`, 'bold')
          : `  ${displayItem}\n`).toString();
        process.stdout.write(typeof output === 'string' ? output : Buffer.from(output));
      });
      
      // Show results count
      process.stdout.write(`\n${filteredItems.length}/${items.length}\n`);
      
      // Move cursor back to input line
      const moveCursorOutput = `\x1B[${displayItems.length + 2}A\x1B[${prompt.length + query.length + 1}G`;
      process.stdout.write(typeof moveCursorOutput === 'string' ? moveCursorOutput : Buffer.from(moveCursorOutput));
    };

    function naive_linechunk(items: string[], query: string, useFuzzy: boolean): string[] {
      if (!query) return items;
      const lowerQuery = query.toLowerCase();
      
      return useFuzzy
        ? items.filter(item => {
            let i = 0;
            let j = 0;
            const lowerItem = item.toLowerCase();
            while (i < lowerItem.length && j < lowerQuery.length) {
              if (lowerItem[i] === lowerQuery[j]) j++;
              i++;
            }
            return j === lowerQuery.length;
          })
        : items.filter(item => item.toLowerCase().includes(lowerQuery));
    }

    function highlightMatch(str: string, query: string): string {
      if (!query) return str;
      
      const lowerStr = str.toLowerCase();
      const lowerQuery = query.toLowerCase();
      let result = '';
      let lastIndex = 0;

      for (let i = 0, j = 0; i < lowerStr.length && j < lowerQuery.length; i++) {
        if (lowerStr[i] === lowerQuery[j]) {
          result += str.substring(lastIndex, i) + fg('yellow')(str[i]);
          lastIndex = i + 1;
          j++;
        }
      }

      result += str.substring(lastIndex);
      return result;
    }

    // Handle keyboard input
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (_, key) => {
      if (!key) return;

      switch (key.name) {
        case 'return':
          process.stdout.write('\x1B[?25h'); // Show cursor
          process.stdin.setRawMode(false);
          rl.close();
          resolve(filteredItems[selectedIndex] || null);
          break;
        case 'escape':
          process.stdout.write('\x1B[?25h'); // Show cursor
          process.stdin.setRawMode(false);
          rl.close();
          resolve(null);
          break;
        case 'backspace':
          query = query.slice(0, -1);
          selectedIndex = 0;
          render();
          break;
        case 'up':
          selectedIndex = Math.max(0, selectedIndex - 1);
          render();
          break;
        case 'down':
          selectedIndex = Math.min(filteredItems.length - 1, selectedIndex + 1);
          render();
          break;
        default:
          if (key.ctrl && key.name === 'c') {
            process.stdout.write('\x1B[?25h'); // Show cursor
            process.stdin.setRawMode(false);
            rl.close();
            resolve(null);
          } else if (key.sequence && !key.ctrl && !key.meta && !key.name.match(/^(up|down|return|escape)$/)) {
            query += key.sequence;
            selectedIndex = 0;
            render();
          }
      }
    });

    // Initial render
    render();
  });
}

export { type SearchOptions, search };
