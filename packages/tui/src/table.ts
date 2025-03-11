interface TableOptions {
  chars?: {
    top?: string;
    'top-mid'?: string;
    'top-left'?: string;
    'top-right'?: string;
    bottom?: string;
    'bottom-mid'?: string;
    'bottom-left'?: string;
    'bottom-right'?: string;
    left?: string;
    'left-mid'?: string;
    mid?: string;
    'mid-mid'?: string;
    right?: string;
    'right-mid'?: string;
    middle?: string;
  };
  style?: {
    head?: string[];
    border?: string[];
    padding?: number;
  };
  head?: string[];
  colWidths?: number[];
  colAligns?: Array<'left' | 'center' | 'right'>;
}

type TableData = string[][];

const defaultChars = {
  'top': '─',
  'top-mid': '┬',
  'top-left': '┌',
  'top-right': '┐',
  'bottom': '─',
  'bottom-mid': '┴',
  'bottom-left': '└',
  'bottom-right': '┘',
  'left': '│',
  'left-mid': '├',
  'mid': '─',
  'mid-mid': '┼',
  'right': '│',
  'right-mid': '┤',
  'middle': '│',
};

const defaultStyle = {
  head: ['bold'],
  border: [],
  padding: 1,
};

const calculateColWidths = (head: string[] = [], rows: TableData = [], padding = 1): number[] => {
  const widths: number[] = [];

  // Check header
  for (const [i, cell] of head.entries()) {
    widths[i] = Math.max(widths[i] || 0, String(cell).length);
  }

  // Check data rows
  for (const row of rows) {
    for (const [i, cell] of row.entries()) {
      widths[i] = Math.max(widths[i] || 0, String(cell).length);
    }
  }

  // Add padding
  return widths.map(w => w + (padding * 2));
};

const padCell = (content: string, width: number, align: 'left' | 'center' | 'right', padding: number): string => {
  const contentWidth = width - (padding * 2);
  const paddedContent = content.padEnd(contentWidth);
  
  if (align === 'right') {
    return ' '.repeat(padding) + paddedContent.padStart(contentWidth) + ' '.repeat(padding);
  }
  if (align === 'center') {
    const leftPad = Math.floor((contentWidth - content.length) / 2);
    const rightPad = contentWidth - content.length - leftPad;
    return ' '.repeat(padding) + ' '.repeat(leftPad) + content + ' '.repeat(rightPad) + ' '.repeat(padding);
  }
  return ' '.repeat(padding) + paddedContent + ' '.repeat(padding);
};

const renderBorder = (position: 'top' | 'mid' | 'bottom', widths: number[], chars: TableOptions['chars']): string => {
  const mergedChars = { ...defaultChars, ...chars };
  
  const { left, mid, right, line } = (() => {
    switch (position) {
      case 'top':
        return {
          left: mergedChars['top-left'] || '┌',
          mid: mergedChars['top-mid'] || '┬',
          right: mergedChars['top-right'] || '┐',
          line: mergedChars.top || '─',
        };
      case 'mid':
        return {
          left: mergedChars['left-mid'] || '├',
          mid: mergedChars['mid-mid'] || '┼',
          right: mergedChars['right-mid'] || '┤',
          line: mergedChars.mid || '─',
        };
      default:
        return {
          left: mergedChars['bottom-left'] || '└',
          mid: mergedChars['bottom-mid'] || '┴',
          right: mergedChars['bottom-right'] || '┘',
          line: mergedChars.bottom || '─',
        };
    }
  })();

  const border = widths.map((width, i) => 
    `${line.repeat(width)}${i < widths.length - 1 ? mid : ''}`
  ).join('');

  return `${left}${border}${right}\n`;
};

const renderRow = (
  row: string[], 
  widths: number[], 
  chars: TableOptions['chars'], 
  aligns: Array<'left' | 'center' | 'right'> = [],
  padding = 1
): string => {
  const mergedChars = { ...defaultChars, ...chars };
  const middle = mergedChars.middle || '│';

  let result = mergedChars.left || '│';

  row.forEach((cell, i) => {
    const width = widths[i];
    const align = aligns[i] || 'left';
    const paddedCell = padCell(cell, width, align, padding);
    
    result += paddedCell;
    if (i < row.length - 1) {
      result += middle;
    }
  });

  result += mergedChars.right || '│';
  result += '\n';

  return result;
};

export const createTable = (options: TableOptions = {}) => {
  const mergedChars = { ...defaultChars, ...options.chars };
  const mergedStyle = { ...defaultStyle, ...options.style };
  const head = options.head || [];
  const colAligns = options.colAligns || [];

  const rows: TableData = [];

  const addRow = (row: string[]) => {
    rows.push(row);
    return { addRow, toString: toStringFn };
  };

  const toStringFn = () => {
    const colWidths = options.colWidths?.length 
      ? options.colWidths 
      : calculateColWidths(head, rows, mergedStyle.padding);

    let result = renderBorder('top', colWidths, mergedChars);

    if (head?.length) {
      result += renderRow(head, colWidths, mergedChars, colAligns, mergedStyle.padding);
      result += renderBorder('mid', colWidths, mergedChars);
    }

    for (const [index, row] of rows.entries()) {
      result += renderRow(row, colWidths, mergedChars, colAligns, mergedStyle.padding);
      if (index < rows.length - 1) {
        result += renderBorder('mid', colWidths, mergedChars);
      }
    }

    result += renderBorder('bottom', colWidths, mergedChars);
    return result;
  };

  return { addRow, toString: toStringFn };
};
