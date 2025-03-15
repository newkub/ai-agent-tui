import loadConfig from '../../ai.config';

export interface AIProviderConfig<TOptions extends Record<string, unknown> = Record<string, unknown>> {
  apiKey: string;
  defaultModel?: string;
  maxTokens?: number;
  options?: TOptions;
}

export interface OpenAIConfig extends AIProviderConfig {}

export interface AnthropicConfig extends AIProviderConfig {}

export interface StabilityAIConfig extends AIProviderConfig<{ imageSize: string }> {
  imageSize: string;
}

export type ProviderConfig = OpenAIConfig | AnthropicConfig | StabilityAIConfig;

export interface ToolConfig {
  defaultProvider: string;
  options?: Record<string, unknown>;
}

export interface AiConfig {
  providers: {
    openai?: OpenAIConfig;
    anthropic?: AnthropicConfig;
    stabilityai?: StabilityAIConfig;
    [key: string]: ProviderConfig | undefined;
  };
  tools: {
    textGen: ToolConfig;
    imageGen: ToolConfig;
    [key: string]: ToolConfig;
  };
  rateLimiting: {
    requestsPerMinute: number;
    burstLimit: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
  };
}

export function defineConfig(config: AiConfig): AiConfig {
  return config;
}

export function getConfig(): AiConfig {
  return loadConfig;
}