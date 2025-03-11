import { createOpenAIProvider } from './openai';
import { createAnthropicProvider } from './anthropic';
import { createGeminiProvider } from './gemini';
import type { Provider } from '../types/providers';

const providerMap = {
  openai: (message: string) => {
    const provider = createOpenAIProvider(process.env.OPENAI_API_KEY || '');
    return provider(message);
  },
  anthropic: (message: string) => {
    const provider = createAnthropicProvider(process.env.ANTHROPIC_API_KEY || '');
    return provider(message);
  },
  gemini: (message: string) => {
    const provider = createGeminiProvider(process.env.GEMINI_API_KEY || '');
    return provider(message);
  }
};

export const chat = async (provider: Provider, message: string): Promise<string | undefined> => {
  const providerFunction = providerMap[provider];
  
  if (!providerFunction) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  return providerFunction(message);
};
