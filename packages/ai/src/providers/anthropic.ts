import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './BaseProvider';
import { handleProviderError, mapMessages, defaultProviderConfig, logMetrics, withRetry, validateCompletionOptions } from '../utils';
import type { AIClient, CompletionOptions, CompletionResponse, ImageGenerationOptions, ImageGenerationResponse } from '../types/providers';

interface AnthropicCompletionOptions extends CompletionOptions {
  max_tokens_to_sample?: number;
  stop_sequences?: string[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export class AnthropicProvider extends BaseProvider {
  private anthropic: Anthropic;
  private cache: Map<string, CompletionResponse>;
  public config: typeof defaultProviderConfig;

  constructor(config?: Partial<typeof defaultProviderConfig>) {
    super({
      ...defaultProviderConfig,
      ...config,
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      providerName: 'Anthropic'
    });
    this.config = {
      ...defaultProviderConfig,
      ...config
    };
    this.anthropic = new Anthropic({
      apiKey: this.apiKey
    });
    this.cache = new Map();
  }

  private logRequest(context: string, payload: Record<string, unknown>) {
    console.log(`[${this.providerName}] ${context} Request:`, payload);
  }

  private logResponse(context: string, response: Anthropic.Completion, duration: number) {
    console.log(`[${this.providerName}] ${context} Response (${duration}ms):`, response);
  }

  chat = {
    completions: {
      create: async (options: AnthropicCompletionOptions): Promise<CompletionResponse> => {
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
            prompt: messages
          });

          const response = await withRetry(
            () => this.anthropic.completions.create({
              model: options.model,
              prompt: messages,
              max_tokens_to_sample: options.max_tokens ?? this.config.maxTokens,
              temperature: options.temperature ?? this.config.temperature,
              top_p: options.top_p ?? this.config.topP,
              stop_sequences: options.stop_sequences
            }),
            MAX_RETRIES,
            RETRY_DELAY_MS
          );

          const duration = Date.now() - startTime;
          this.logResponse('Chat Completion', response, duration);
          logMetrics(duration, true);

          const result: CompletionResponse = {
            id: response.completion,
            choices: [{
              message: {
                content: response.completion || ''
              }
            }]
          };

          this.cache.set(cacheKey, result);
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          logMetrics(duration, false);

          if (error instanceof Anthropic.APIError) {
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

export const createAnthropicClient = (config?: Partial<typeof defaultProviderConfig>): AIClient => {
  return new AnthropicProvider(config);
};
