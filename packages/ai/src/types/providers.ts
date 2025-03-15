export interface ProviderConfig {
  apiKey: string;
  organizationId?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CompletionOptions {
  model: string;
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

export interface CompletionResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ImageGenerationOptions {
  model: string;
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024';
}

export interface ImageGenerationResponse {
  data: Array<{
    url: string;
  }>;
}

export interface ImageGenerationResult {
  url: string;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
}

export interface AIClient {
  chat: {
    completions: {
      create(options: CompletionOptions): Promise<CompletionResponse>;
    };
  };
  images?: {
    generate(options: ImageGenerationOptions): Promise<ImageGenerationResponse>;
  };
}

export interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AIError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'AIError';
  }
}