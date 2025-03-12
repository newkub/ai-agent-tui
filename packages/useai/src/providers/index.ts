import { createOpenAIProvider } from './openai';
import { createAnthropicProvider } from './anthropic';
import { createGeminiProvider } from './gemini';
import type { ChatProvider } from '../types/providers';

const providers: Record<string, ChatProvider> = {
  openai: createOpenAIProvider(process.env.OPENAI_API_KEY || ''),
  anthropic: createAnthropicProvider(process.env.ANTHROPIC_API_KEY || ''),
  gemini: createGeminiProvider(process.env.GEMINI_API_KEY || '')
};

export const chat = async (provider: keyof typeof providers, message: string): Promise<string | undefined> => {
  const providerFunction = providers[provider];
  
  if (!providerFunction) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  return providerFunction.chat([{ role: 'user', content: message }]);
};
