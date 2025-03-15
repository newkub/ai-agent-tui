import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './BaseProvider';
import { mapMessages } from '../utils/provider';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse } from '../types/providers';

export class AnthropicProvider extends BaseProvider {
  private anthropic: Anthropic;

  constructor() {
    super(process.env.ANTHROPIC_API_KEY || '', 'Anthropic');
    this.anthropic = new Anthropic({ apiKey: this.apiKey });
  }

  chat = {
    completions: {
      create: async (options: CompletionOptions): Promise<CompletionResponse> => {
        try {
          const messages = mapMessages(options.messages);
          const response = await this.anthropic.completions.create({
            model: options.model,
            prompt: messages.map(msg => `${msg.role}: ${msg.content}`).join('\n'),
            max_tokens_to_sample: options.max_tokens ?? 100,
            temperature: options.temperature ?? 0.7,
            top_p: options.top_p ?? 1,
          });

          return {
            id: response.completion,
            choices: [{
              message: {
                content: response.completion
              }
            }]
          };
        } catch (error) {
          this.handleError(error, 'chat completion');
        }
      }
    }
  };

  images = {
    generate: async (_options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
      try {
        throw new Error('Image generation not supported by Anthropic');
      } catch (error) {
        this.handleError(error, 'image generation');
      }
    }
  };
}

export const createAnthropicClient = (): AIClient => {
  return new AnthropicProvider();
};
