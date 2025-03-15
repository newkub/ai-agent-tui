import OpenAI from 'openai';
import { BaseProvider } from './BaseProvider';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse, ImageGenerationResult } from '../types/providers';
import { AIError } from '../types/providers';

export class OpenAIProvider extends BaseProvider {
  private openai: OpenAI;

  constructor(config: { apiKey: string; organizationId?: string; timeout?: number; maxRetries?: number }) {
    super(config.apiKey, 'OpenAI');
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      organization: config.organizationId,
      timeout: config.timeout,
      maxRetries: config.maxRetries
    });
  }

  chat = {
    completions: {
      create: async (options: CompletionOptions): Promise<CompletionResponse> => {
        try {
          const response = await this.openai.chat.completions.create({
            model: options.model,
            messages: options.messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.max_tokens ?? 100,
            top_p: options.top_p ?? 1,
            frequency_penalty: options.frequency_penalty ?? 0,
            presence_penalty: options.presence_penalty ?? 0,
            stop: options.stop
          });

          return {
            id: response.id,
            choices: response.choices.map(choice => ({
              message: {
                content: choice.message.content || ''
              }
            }))
          };
        } catch (error) {
          this.handleError(error, 'chat completion');
        }
      }
    }
  };

  images = {
    generate: async (options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
      try {
        if (!this.openai.images) throw new Error('Images API not available');

        const response = await this.openai.images.generate({
          model: options.model,
          prompt: options.prompt,
          n: options.n ?? 1,
          size: options.size ?? '1024x1024'
        });

        return {
          data: response.data.map(image => ({
            url: image.url || ''
          }))
        };
      } catch (error) {
        this.handleError(error, 'image generation');
      }
    }
  };
}

export const createOpenAIClient = (config: { apiKey: string; organizationId?: string; timeout?: number; maxRetries?: number }): AIClient => {
  return new OpenAIProvider(config);
};

export const textgen = async (client: AIClient, prompt: string): Promise<string> => {
  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.7
  });

  return completion.choices[0]?.message?.content?.trim() || '';
};

export const imagegen = async (client: AIClient, prompt: string): Promise<ImageGenerationResult> => {
  if (!client.images?.generate) throw new Error('Image generation not supported');
  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024'
  });

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) throw new AIError('No image URL returned from OpenAI');

  return {
    url: imageUrl,
    width: 1024,
    height: 1024,
    format: 'png'
  };
};

export const client = (client: AIClient) => {
  return {
    completions: client.completions?.create ? {
      create: client.completions.create
    } : null,
    images: client.images?.generate ? {
      generate: client.images.generate
    } : null,
    chat: client.chat?.completions?.create ? {
      completions: {
        create: client.chat.completions.create
      }
    } : null
  };
};
