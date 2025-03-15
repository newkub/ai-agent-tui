import { BaseProvider } from './BaseProvider';
import { handleProviderError, mapMessages, defaultProviderConfig, logMetrics, withRetry, validateCompletionOptions } from '../utils';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse } from '../types/providers';

declare module '../types/providers' {
  interface ImageGenerationOptions {
    [key: string]: unknown;
    response_format?: string;
  }

  interface ImageGenerationResponse {
    [key: string]: unknown;
  }
}

interface OpenAICompletionOptions extends CompletionOptions {
  max_tokens?: number;
  stop?: string[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export class OpenAIProvider extends BaseProvider {
  private cache: Map<string, CompletionResponse>;
  public config: typeof defaultProviderConfig;

  constructor(config?: Partial<typeof defaultProviderConfig>) {
    super({
      ...defaultProviderConfig,
      ...config,
      apiKey: process.env.OPENAI_API_KEY || '',
      providerName: 'OpenAI'
    });
    this.config = {
      ...defaultProviderConfig,
      ...config
    };
    this.cache = new Map();
  }

  private logRequest(context: string, payload: Record<string, unknown>) {
    console.log(`[${this.providerName}] ${context} Request:`, payload);
  }

  private logResponse(context: string, response: Record<string, unknown>, duration: number) {
    console.log(`[${this.providerName}] ${context} Response (${duration}ms):`, response);
  }

  chat = {
    completions: {
      create: async (options: OpenAICompletionOptions): Promise<CompletionResponse> => {
        validateCompletionOptions(options);

        const cacheKey = JSON.stringify(options);
        const cachedResponse = this.cache.get(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        const startTime = Date.now();
        try {
          const messages = mapMessages(options.messages);
          this.logRequest('Chat Completion', {
            model: options.model,
            messages: messages
          });

          const response = await withRetry(
            () => fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
              },
              body: JSON.stringify({
                model: options.model,
                messages: messages,
                max_tokens: options.max_tokens ?? this.config.maxTokens,
                temperature: options.temperature ?? this.config.temperature,
                top_p: options.top_p ?? this.config.topP,
                stop: options.stop
              })
            }),
            MAX_RETRIES,
            RETRY_DELAY_MS
          );

          const data = await response.json();
          const duration = Date.now() - startTime;
          this.logResponse('Chat Completion', data, duration);
          logMetrics(duration, true);

          const result: CompletionResponse = {
            id: data.id,
            choices: [{
              message: {
                content: data.choices[0].message.content || ''
              }
            }]
          };

          this.cache.set(cacheKey, result);
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          logMetrics(duration, false);

          if (error instanceof Error && 'status' in error && typeof error.status === 'number' && error.status >= 400) {
            switch (error.status) {
              case 429:
                throw new Error('Rate limit exceeded. Please try again later.');
              case 401:
                throw new Error('Invalid API key. Please check your configuration.');
              default:
                handleProviderError(error, 'chat completion', this.providerName);
            }
          } else {
            handleProviderError(error, 'chat completion', this.providerName);
          }
          throw error;
        }
      }
    }
  };

  images = {
    generate: async (options: ImageGenerationOptions): Promise<ImageGenerationResponse> => {
      const startTime = Date.now();
      try {
        this.logRequest('Image Generation', options as Record<string, unknown>);

        const response = await withRetry(
          () => fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
              prompt: options.prompt,
              n: options.n || 1,
              size: options.size || '1024x1024',
              response_format: options.response_format || 'url'
            })
          }),
          MAX_RETRIES,
          RETRY_DELAY_MS
        );

        const data: ImageGenerationResponse = await response.json();
        const duration = Date.now() - startTime;
        this.logResponse('Image Generation', data as Record<string, unknown>, duration);
        logMetrics(duration, true);

        return data;
      } catch (error) {
        const duration = Date.now() - startTime;
        logMetrics(duration, false);
        handleProviderError(error, 'image generation', this.providerName);
        throw error;
      }
    }
  };
}

export const createOpenAIClient = (config?: Partial<typeof defaultProviderConfig>): AIClient => {
  return new OpenAIProvider(config);
};
