export enum ProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Deepseek = 'deepseek',
}

export interface ProviderConfig {
  apiKey?: string;
  model?: string;
  options?: Record<string, unknown>;
}

export interface AnthropicParams {
  model: string;
  maxTokensToSample?: number;
  temperature?: number;
}

export interface DeepseekParams {
  model: string;
  maxTokens?: number;
  topP?: number;
}

export interface OpenAIParams {
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ImageGenerationResult {
  url: string;
  width: number;
  height: number;
  format: string;
}

export interface AIProvider {
  textgen(prompt: string): Promise<string>;
  imagegen(prompt: string): Promise<ImageGenerationResult>;
}

export type ProviderParams = 'openai' | 'anthropic' | 'deepseek';
