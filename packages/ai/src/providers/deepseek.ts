import { BaseProvider } from './BaseProvider';
import { handleProviderError, defaultProviderConfig } from '../utils';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse } from '../types/providers';
import type OpenAI from 'openai';

export class DeepseekProvider extends BaseProvider {
  private deepseek: {
    chat: {
      completions: {
        create: (options: OpenAI.ChatCompletionCreateParams) => Promise<OpenAI.ChatCompletion>;
      };
    };
    images: {
      generate: (options: OpenAI.ImageGenerateParams) => Promise<OpenAI.ImagesResponse>;
    };
  };

  constructor() {
    super({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      providerName: 'Deepseek'
    });
    this.deepseek = {
      chat: {
        completions: {
          create: async (options: OpenAI.ChatCompletionCreateParams) => {
            return {
              id: '',
              choices: [{
                message: {
                  content: '',
                  role: 'assistant',
                  refusal: null
                },
                finish_reason: 'stop',
                index: 0,
                logprobs: null
              }],
              created: Date.now(),
              model: options.model,
              object: 'chat.completion'
            };
          }
        }
      },
      images: {
        generate: async () => {
          throw new Error('Image generation is not supported by Deepseek');
        }
      }
    };
  }

  chat = {
    completions: {
      create: async (options: CompletionOptions): Promise<CompletionResponse> => {
        try {
          const messages = options.messages.map(message => ({
            role: message.role,
            content: message.content
          }));
          const response = await this.deepseek.chat.completions.create({
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
    generate: async (_options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
      try {
        throw new Error('Image generation is not supported by Deepseek');
      } catch (error) {
        handleProviderError(error, 'image generation', this.providerName);
        throw error;
      }
    }
  };
}

export const createDeepseekClient = (): AIClient => {
  return new DeepseekProvider();
};
