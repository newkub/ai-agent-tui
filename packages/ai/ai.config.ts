import { defineConfig, type AiConfig } from './src/config/index';

const providers = {
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

const tools = {
  textGen: {
    defaultProvider: 'openai',
  },
  imageGen: {
    defaultProvider: 'stabilityai',
  },
};

export const rateLimiting = {
  requestsPerMinute: 60,
  burstLimit: 10,
};

export const logging = {
  level: 'info',
  format: 'json',
};

export const security = {
  encryptionKey: process.env.ENCRYPTION_KEY || '',
  tokenExpiration: '1h',
};

export { providers, tools };

export default defineConfig({
  providers,
  tools,
  rateLimiting,
  logging,
  security,
  caching: {
    enabled: true,
    ttl: 3600,
  },
} satisfies AiConfig);