import type { TableOptions, TableColumn } from '../types/table';
import { color } from './color';

function isColorKey(key: string): key is keyof typeof color {
  return key in color;
}

function createTable(columns: TableColumn[], options: TableOptions = {}) {
  const { 
    padding = 2, 
    border = true, 
    headerColor = 'cyan', 
    rowColor = 'white' 
  } = options;
  
  const columnWidths = columns.map(col => {
    return col.width || Math.max(col.header.length, 10);
  });
  
  const drawHorizontalLine = (char: string, connector: string) => {
    return `${char}${columns.map((_, i) => char.repeat(columnWidths[i] + padding * 2)).join(connector)}${char}\n`;
  };
  
  const formatCell = (value: string, width: number, colorName: string, align: 'left' | 'center' | 'right' = 'left') => {
    const colorFn = isColorKey(colorName) ? color[colorName] : color.white;
    let formattedValue = String(value || '');
    
    if (align === 'right') {
      formattedValue = formattedValue.padStart(width);
    } else if (align === 'center') {
      const leftPadding = Math.floor((width - formattedValue.length) / 2);
      formattedValue = ' '.repeat(leftPadding) + formattedValue;
      formattedValue = formattedValue.padEnd(width);
    } else {
      formattedValue = formattedValue.padEnd(width);
    }
    
    return colorFn(formattedValue);
  };
  
  return {
    render(data: Record<string, string | number>[]) {
      let output = '';
      
      if (border) {
        output += drawHorizontalLine('┌', '┬');
      }
      
      // Header row
      output += '│ ';
      columns.forEach((col, i) => {
        const formattedHeader = formatCell(col.header, columnWidths[i], headerColor, col.align);
        output += `${formattedHeader} │ `;
      });
      output += '\n';
      
      if (border) {
        output += drawHorizontalLine('├', '┼');
      }
      
      // Data rows
      for (const row of data) {
        output += '│ ';
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          const value = String(row[col.key] || '');
          const formattedValue = formatCell(value, columnWidths[i], rowColor, col.align);
          output += `${formattedValue} │ `;
        }
        output += '\n';
      }
      
      if (border) {
        output += drawHorizontalLine('└', '┴');
      }
      
      return output;
    }
  };
}

export { createTable };
