import type { CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse, AIClient } from '../types/providers';
import { AIError } from '../types/providers';
import { mapMessages } from '../utils/provider';

export const validateApiKey = (apiKey: string | undefined, providerName: string): void => {
  if (!apiKey) {
    throw new AIError(`${providerName} API key is required`);
  }
};

export abstract class BaseProvider implements AIClient {
  protected readonly apiKey: string;
  protected readonly providerName: string;

  constructor(apiKey: string, providerName: string) {
    this.apiKey = apiKey;
    this.providerName = providerName;
    validateApiKey(this.apiKey, this.providerName);
  }

  protected handleError(error: unknown, context: string): never {
    throw new AIError(`[${this.providerName}] Error in ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  protected mapMessages(messages: CompletionOptions['messages']) {
    return mapMessages(messages);
  }

  abstract chat: {
    completions: {
      create(options: CompletionOptions): Promise<CompletionResponse>;
    };
  };

  abstract images?: {
    generate(options: ImageGenerationOptions): Promise<ImageGenerationResponse>;
  };
}

export const handleTextGenerationError = (error: unknown): never => {
  console.error('Text Generation Error:', error);
  throw new AIError('Failed to generate text', error);
};

export const handleImageGenerationError = (error: unknown): never => {
  console.error('Image Generation Error:', error);
  throw new AIError('Failed to generate image', error);
};
