export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  modes?: string[];
  chat?: ChatProvider;
  generate?: GenerateProvider;
  embeddings?: EmbeddingsProvider;
  vision?: VisionProvider;

}

type OpenAIModel = 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'gpt-4-vision-preview';
type AnthropicModel = 'claude-2' | 'claude-3' | 'claude-instant';
type GeminiModel = 'gemini-pro' | 'gemini-ultra' | 'gemini-nano';
type Temperature = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
type DetailLevel = 'low' | 'high' | 'auto';
type MaxTokens = 512 | 1024 | 2048 | 4096 | 8192;

export interface ChatProvider {
  model: OpenAIModel | AnthropicModel | GeminiModel;
  temperature: Temperature;
  maxTokens: MaxTokens;
  systemPrompt: string;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface GenerateProvider {
  model: OpenAIModel | AnthropicModel | GeminiModel;
  temperature: Temperature;
  maxTokens: MaxTokens;
  stopSequences: string[];
  topK?: number;
  topP?: number;
}

export interface EmbeddingsProvider {
  model: 'text-embedding-ada-002' | 'embedding-001' | 'text-embedding-3-small' | 'text-embedding-3-large';
  dimensions: 512 | 768 | 1024 | 1536 | 2048;
}

export interface VisionProvider {
  model: 'gpt-4-vision-preview' | 'gemini-pro-vision';
  maxTokens: MaxTokens;
  detail: DetailLevel;
  imageSize?: '256x256' | '512x512' | '1024x1024';
}

export interface UseAiConfig {
  openai: ProviderConfig;
  anthropic: ProviderConfig;
  gemini: ProviderConfig;
}

export type DefaultConfig = UseAiConfig;

export const defaultConfig: DefaultConfig = {
  openai: {
    apiKey: 'YOUR_OPENAI_API_KEY',
    baseUrl: 'https://api.openai.com/v1',
    chat: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are a helpful assistant.'
    },
    generate: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      stopSequences: ['\n']
    },
    embeddings: {
      model: 'text-embedding-ada-002',
      dimensions: 1536
    },
    vision: {
      model: 'gpt-4-vision-preview',
      maxTokens: 4096,
      detail: 'auto'
    }
  },
  anthropic: {
    apiKey: 'YOUR_ANTHROPIC_API_KEY',
    baseUrl: 'https://api.anthropic.com/v1',
    chat: {
      model: 'claude-2',
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: 'You are a helpful assistant.'
    },
    generate: {
      model: 'claude-2',
      temperature: 0.7,
      maxTokens: 4096,
      stopSequences: ['\n']
    }
  },
  gemini: {
    apiKey: 'YOUR_GEMINI_API_KEY',
    baseUrl: 'https://api.gemini.ai/v1',
    chat: {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are a helpful assistant.'
    },
    generate: {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048,
      stopSequences: ['\n']
    },
    embeddings: {
      model: 'embedding-001',
      dimensions: 768
    }
  }
};

export function defineConfig(config?: DefaultConfig): DefaultConfig {
  return config || defaultConfig;
}
