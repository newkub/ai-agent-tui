import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './BaseProvider';
import { handleProviderError, mapMessages, defaultProviderConfig } from '../utils';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse } from '../types/providers';

export class AnthropicProvider extends BaseProvider {
  private anthropic: Anthropic;

  constructor() {
    super({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      providerName: 'Anthropic'
    });
    this.anthropic = new Anthropic({
      apiKey: this.apiKey
    });
  }

  chat = {
    completions: {
      create: async (options: CompletionOptions): Promise<CompletionResponse> => {
        try {
          const messages = mapMessages(options.messages);
          const response = await this.anthropic.completions.create({
            model: options.model,
            prompt: messages,
            max_tokens_to_sample: options.max_tokens ?? defaultProviderConfig.maxTokens,
            temperature: options.temperature ?? defaultProviderConfig.temperature,
            top_p: options.top_p ?? defaultProviderConfig.topP
          });

          return {
            id: response.completion,
            choices: [{
              message: {
                content: response.completion || ''
              }
            }]
          };
        } catch (error) {
          handleProviderError(error, 'chat completion', this.providerName);
          throw error;
        }
      }
    }
  };

  images = {
    generate: async (_options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
      try {
        throw new Error('Image generation is not supported by Anthropic');
      } catch (error) {
        handleProviderError(error, 'image generation', this.providerName);
        throw error;
      }
    }
  };
}

export const createAnthropicClient = (): AIClient => {
  return new AnthropicProvider();
};
