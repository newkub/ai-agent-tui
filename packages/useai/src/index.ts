import { handleOpenAI } from './openai';
import { handleAnthropic } from './anthropic';

export const chat = async (provider: 'openai' | 'anthropic', message: string): Promise<string | undefined> => {
  switch (provider) {
    case 'openai':
      return handleOpenAI(message);
    case 'anthropic':
      return handleAnthropic(message);
    default:
      throw new Error('Unsupported provider');
  }
};
