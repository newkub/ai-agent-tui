import { defineConfig } from './src/config/index';

export default defineConfig({
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      defaultModel: 'gpt-4',
      maxTokens: 1000,
      options: {},
      rateLimit: {
        requestsPerMinute: 30,
        burstLimit: 5
      }
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      defaultModel: 'claude-3-opus',
      maxTokens: 1000,
      options: {},
      rateLimit: {
        requestsPerMinute: 30,
        burstLimit: 5
      }
    }
  },
  tools: {
    textGen: {
      defaultProvider: 'openai',
    },
    imageGen: {
      defaultProvider: 'stabilityai',
    }
  },
  rateLimiting: {
    requestsPerMinute: 60,
    burstLimit: 10
  },
  caching: {
    enabled: true,
    ttl: 3600
  }
});