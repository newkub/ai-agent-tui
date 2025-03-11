export type ColorStyle = 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden' | 'strikethrough';

export type ColorName = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';

const colors: Record<ColorName, number> = {
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  gray: 8
};

const styleCodes: Record<ColorStyle, number> = {
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  inverse: 7,
  hidden: 8,
  strikethrough: 9
};

const applyCode = (text: string, code: number): string => 
  `\x1b[${code}m${text}\x1b[0m`;

export const fg = (color: ColorName) => (text: string): string => 
  `\x1b[38;5;${colors[color]}m${text}\x1b[0m`;

export const bg = (color: ColorName) => (text: string): string => 
  `\x1b[48;5;${colors[color]}m${text}\x1b[0m`;

export const style = (p0: (text: string) => string, p1: string, styleType: ColorStyle) => (text: string): string => 
  applyCode(text, styleCodes[styleType]);

export const compose = (...fns: Array<(text: string) => string>) => (text: string): string => 
  fns.reduce((acc, fn) => fn(acc), text);

export const color = (text: string) => ({
  fg: (color: ColorName) => fg(color)(text),
  bg: (color: ColorName) => bg(color)(text),
  style: (styleType: ColorStyle) => style((text: string) => text, text, styleType),
  toString: () => text
});
