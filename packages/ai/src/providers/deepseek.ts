import DeepSeek from 'openai';
import { BaseProvider } from './BaseProvider';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse, ImageGenerationResult } from '../types/providers';
import { AIError } from '../types/providers';
import { mapMessages, handleTextGenerationError, handleImageGenerationError } from '../utils/provider';

export class DeepseekProvider extends BaseProvider {
  private deepseek: DeepSeek;

  constructor() {
    super(process.env.DEEPSEEK_API_KEY || '', 'Deepseek');
    this.deepseek = new DeepSeek({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.apiKey
    });
  }

  chat = {
    completions: {
      create: async (options: CompletionOptions): Promise<CompletionResponse> => {
        try {
          const messages = mapMessages(options.messages);
          const response = await this.deepseek.chat.completions.create({
            model: options.model,
            messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.max_tokens ?? 100,
            top_p: options.top_p ?? 1,
            frequency_penalty: options.frequency_penalty ?? 0,
            presence_penalty: options.presence_penalty ?? 0,
            stop: options.stop ?? []
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
        if (!this.deepseek.images) throw new Error('Images API not available');

        const response = await this.deepseek.images.generate({
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

export const createDeepseekClient = (): AIClient => {
  return new DeepseekProvider();
};

export const textgen = async (client: AIClient, prompt: string): Promise<string> => {
  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
      stop: []
    });

    return completion.choices[0]?.message?.content?.trim() ?? '';
  } catch (error) {
    handleTextGenerationError(error);
    return '';
  }
};

export const imagegen = async (client: AIClient, prompt: string): Promise<ImageGenerationResult> => {
  try {
    if (!client.images) {
      throw new Error('Image generation not supported');
    }
    const response = await client.images.generate({
      model: 'deepseek-art',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) throw new AIError('No image URL returned from Deepseek');

    return {
      url: imageUrl,
      width: 1024,
      height: 1024,
      format: 'png'
    };
  } catch (error) {
    handleImageGenerationError(error);
    throw error;
  }
};
