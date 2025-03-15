export const providers = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    defaultModel: 'gpt-4',
    maxTokens: 1000,
    options: {},
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    defaultModel: 'claude-3-opus',
    maxTokens: 1000,
    options: {},
  },
};
