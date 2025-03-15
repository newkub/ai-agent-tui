export enum ToolType {
  TextGen = 'textGen',
  ImageGen = 'imageGen',
}

export interface ToolConfig {
  defaultProvider: string;
  options?: Record<string, unknown>;
}

export const tools: Record<ToolType, ToolConfig> = {
  [ToolType.TextGen]: {
    defaultProvider: 'openai',
    options: {
      temperature: 0.7,
      maxTokens: 1000,
    },
  },
  [ToolType.ImageGen]: {
    defaultProvider: 'stabilityai',
    options: {
      imageSize: '1024x1024',
      style: 'digital-art',
    },
  },
};
