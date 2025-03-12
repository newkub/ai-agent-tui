import { Anthropic } from '@anthropic-ai/sdk';
import type { ProviderHandler } from '../types/providers';


export const createAnthropicProvider = (apiKey: string): ProviderHandler => {
  const anthropic = new Anthropic({ apiKey });

  return async (message: string): Promise<string> => {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: message }],
      });

      if (response.content[0].type === 'text') {
        return response.content[0].text;
      }
      return 'No text response received';
    } catch (error) {
      console.error('Error in AnthropicProvider:', error);
      throw error;
    }
  };
};
