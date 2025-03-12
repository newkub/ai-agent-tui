// Simple color utility functions for terminal text styling
const colorize = (text: string, code: number) => `\x1b[${code}m${text}\x1b[0m`;

const color = {
  red: (text: string) => colorize(text, 31),
  green: (text: string) => colorize(text, 32),
  blue: (text: string) => colorize(text, 34),
  yellow: (text: string) => colorize(text, 33),
  magenta: (text: string) => colorize(text, 35),
  cyan: (text: string) => colorize(text, 36),
  white: (text: string) => colorize(text, 37),
  gray: (text: string) => colorize(text, 90),
  bold: (text: string) => colorize(text, 1),
  italic: (text: string) => colorize(text, 3),
  underline: (text: string) => colorize(text, 4),
  dim: (text: string) => colorize(text, 2)
};

import type { ColorOptions } from '../types/color';

function createPrompt(text: string, options?: ColorOptions) {
  let result = text;
  
  if (options?.color && options.color in color) {
    result = color[options.color](result);
  }
  
  if (options?.bold) {
    result = color.bold(result);
  }
  
  if (options?.italic) {
    result = color.italic(result);
  }
  
  if (options?.underline) {
    result = color.underline(result);
  }
  
  if (options?.dim) {
    result = color.dim(result);
  }
  
  return result;
}

export { color, createPrompt };
