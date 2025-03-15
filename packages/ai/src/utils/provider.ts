import { AIError } from '../types/providers';
import type { Message, OpenAIMessage } from '../types/providers';

export const validateApiKey = (apiKey: string | undefined, providerName: string): void => {
  if (!apiKey) throw new AIError(`${providerName} API key is required`);
};

export const mapMessages = (messages: Message[]): OpenAIMessage[] => {
  return messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));
};

export const handleTextGenerationError = (error: unknown): never => {
  console.error('Text Generation Error:', error);
  throw new AIError('Failed to generate text. Please check your input and try again.', error);
};

export const handleImageGenerationError = (error: unknown): never => {
  console.error('Image Generation Error:', error);
  throw new AIError('Failed to generate image. Please check your prompt and try again.', error);
};
