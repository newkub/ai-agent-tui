export interface AiConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface DefaultConfig {
  providers: {
    openai: {
      apiKey: string;
      baseUrl: string;
    };
    anthropic: {
      apiKey: string;
    };
    gemini: {
      apiKey: string;
    };
  };
  ai: AiConfig;
  ignoreFiles: string[];
}

export const defaultConfig: DefaultConfig = {
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
    },
  },
  ai: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
  },
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    'build/**',
  ],
};
