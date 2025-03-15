import type { CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse, AIClient } from '../types/providers';
import { AIError } from '../types/providers';
import { mapMessages } from '../utils';

export interface BaseProviderConfig {
  apiKey: string;
  providerName: string;
}

export const validateApiKey = (config: BaseProviderConfig): void => {
  if (!config.apiKey) {
    throw new AIError(`${config.providerName} API key is required`);
  }
};

export abstract class BaseProvider implements AIClient {
  protected readonly apiKey: string;
  protected readonly providerName: string;

  constructor(config: BaseProviderConfig) {
    this.apiKey = config.apiKey;
    this.providerName = config.providerName;
    validateApiKey(config);
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
