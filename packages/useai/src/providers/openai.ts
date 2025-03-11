import { OpenAI } from 'openai';
import type { ProviderHandler } from '../types/providers';

export const createOpenAIProvider = (apiKey: string): ProviderHandler => {
  const openai = new OpenAI({ apiKey });

  return async (message: string): Promise<string> => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-4',
      });
      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error in OpenAIProvider:', error);
      throw error;
    }
  };
};
