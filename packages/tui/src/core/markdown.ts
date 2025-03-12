import { color } from './color';
import type { MarkdownStyle, RenderMarkdownFunction } from '../types/markdown';

const styles: MarkdownStyle = {
  heading1: (text: string) => color.bold(color.underline(color.cyan(text))),
  heading2: (text: string) => color.bold(color.cyan(text)),
  heading3: (text: string) => color.bold(color.blue(text)),
  bold: (text: string) => color.bold(text),
  italic: (text: string) => color.italic(text),
  code: (text: string) => color.gray(text),
  codeBlock: (text: string) => color.gray(text),
  blockquote: (text: string) => color.gray(`│ ${text}`),
  listItem: (text: string) => `• ${text}`,
  link: (text: string, url: string) => `${text} ${color.dim(`(${url})`)}`,
};

interface MarkdownPattern {
  pattern: RegExp;
  replacement: (match: string, ...groups: string[]) => string;
}

const renderMarkdown: RenderMarkdownFunction = (markdown: string) => {
  const patterns: MarkdownPattern[] = [
    { pattern: /^# (.+)$/gm, replacement: (_, text) => styles.heading1(text) },
    { pattern: /^## (.+)$/gm, replacement: (_, text) => styles.heading2(text) },
    { pattern: /^### (.+)$/gm, replacement: (_, text) => styles.heading3(text) },
    { pattern: /\*\*(.+?)\*\*/g, replacement: (_, text) => styles.bold(text) },
    { pattern: /\*(.+?)\*/g, replacement: (_, text) => styles.italic(text) },
    { pattern: /`(.+?)`/g, replacement: (_, text) => styles.code(text) },
    { pattern: /^> (.+)$/gm, replacement: (_, text) => styles.blockquote(text) },
    { pattern: /^- (.+)$/gm, replacement: (_, text) => styles.listItem(text) },
    { 
      pattern: /```[\s\S]+?```/g, 
      replacement: (match) => styles.codeBlock(match.slice(3, -3).trim()) 
    },
    { 
      pattern: /\[(.+?)\]\((.+?)\)/g, 
      replacement: (_, text, url) => styles.link(text, url) 
    },
  ];

  return patterns.reduce(
    (text, { pattern, replacement }) => text.replace(pattern, replacement),
    markdown
  );
};

export { renderMarkdown, styles };
