type MarkdownStyle = {
  heading1: (text: string) => string;
  heading2: (text: string) => string;
  heading3: (text: string) => string;
  bold: (text: string) => string;
  italic: (text: string) => string;
  code: (text: string) => string;
  codeBlock: (text: string) => string;
  blockquote: (text: string) => string;
  listItem: (text: string) => string;
  link: (text: string, url: string) => string;
};

type RenderMarkdownFunction = (markdown: string) => string;

export type { MarkdownStyle, RenderMarkdownFunction };
