import OpenAI from 'openai';
import { BaseProvider } from './BaseProvider';
import { handleProviderError, defaultProviderConfig } from '../utils';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse } from '../types/providers';

export class OpenAIProvider extends BaseProvider {
  private openai: OpenAI;

  constructor() {
    super({
      apiKey: process.env.OPENAI_API_KEY || '',
      providerName: 'OpenAI'
    });
    this.openai = new OpenAI({
      apiKey: this.apiKey
    });
  }

  chat = {
    completions: {
      create: async (options: CompletionOptions): Promise<CompletionResponse> => {
        try {
          const messages = options.messages.map(message => ({
            role: message.role,
            content: message.content
          }));
          const response = await this.openai.chat.completions.create({
            model: options.model,
            messages,
            max_tokens: options.max_tokens ?? defaultProviderConfig.maxTokens,
            temperature: options.temperature ?? defaultProviderConfig.temperature,
            top_p: options.top_p ?? defaultProviderConfig.topP
          });

          return {
            id: response.id,
            choices: response.choices.map((choice: OpenAI.ChatCompletion.Choice) => ({
              message: {
                content: choice.message.content || ''
              }
            }))
          };
        } catch (error) {
          handleProviderError(error, 'chat completion', this.providerName);
          throw error;
        }
      }
    }
  };

  images = {
    generate: async (options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
      try {
        const response = await this.openai.images.generate({
          model: options.model,
          prompt: options.prompt,
          n: options.n ?? defaultProviderConfig.imageCount,
          size: (options.size ?? defaultProviderConfig.imageSize) as '1024x1024' | '256x256' | '512x512' | '1792x1024' | '1024x1792'
        });

        return {
          data: response.data.map((image: OpenAI.Image) => ({
            url: image.url || ''
          }))
        };
      } catch (error) {
        handleProviderError(error, 'image generation', this.providerName);
        throw error;
      }
    }
  };
}

export const createOpenAIClient = (): AIClient => {
  return new OpenAIProvider();
};
