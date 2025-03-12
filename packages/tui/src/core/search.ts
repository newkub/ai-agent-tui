import type { FzfOptions, FzfResult } from '../types/search';
import { createInterface } from 'readline';

function fzf(options: FzfOptions): Promise<FzfResult | null> {
  const { list, prompt = '> ', height = 10, multiSelect = false } = options;
  
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    let selectedIndex = 0;
    let filteredList = [...list];
    let query = '';
    
    const render = () => {
      console.clear();
      console.log(`${prompt}${query}`);
      
      const displayItems = filteredList.slice(0, height);
      displayItems.forEach((item, index) => {
        const prefix = index === selectedIndex ? '> ' : '  ';
        console.log(`${prefix}${item}`);
      });
      
      if (filteredList.length > height) {
        console.log(`... ${filteredList.length - height} more items`);
      }
    };
    
    const filter = () => {
      filteredList = query 
        ? list.filter(item => item.toLowerCase().includes(query.toLowerCase()))
        : [...list];
        
      selectedIndex = Math.min(Math.max(0, selectedIndex), filteredList.length - 1);
    };
    
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.removeAllListeners('keypress');
      rl.close();
      console.clear();
    };
    
    const selectItem = () => {
      if (filteredList.length > 0) {
        cleanup();
        resolve({
          value: filteredList[selectedIndex],
          index: list.indexOf(filteredList[selectedIndex])
        });
      }
    };
    
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (_, key) => {
      if (key.name === 'c' && key.ctrl) {
        cleanup();
        resolve(null);
      } else if (key.name === 'return') {
        selectItem();
      } else if (key.name === 'up') {
        selectedIndex = Math.max(0, selectedIndex - 1);
        render();
      } else if (key.name === 'down') {
        selectedIndex = Math.min(filteredList.length - 1, selectedIndex + 1);
        render();
      } else if (key.name === 'backspace') {
        query = query.slice(0, -1);
        filter();
        render();
      } else if (key.sequence && !key.ctrl && !key.meta && !key.name) {
        query += key.sequence;
        filter();
        render();
      }
    });
    
    filter();
    render();
  });
}

export { fzf };
