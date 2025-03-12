export type SupportedLanguage = 
  | 'English' 
  | 'Thai' 
  | 'Spanish' 
  | 'French' 
  | 'German' 
  | 'Chinese' 
  | 'Japanese' 
  | 'Korean' 
  | 'Russian' 
  | 'Portuguese' 
  | 'Italian' 
  | 'Dutch' 
  | 'Arabic' 
  | 'Hindi' 
  | 'Turkish'
  | 'Vietnamese'
  | 'Polish'
  | 'Swedish'
  | 'Norwegian'
  | 'Danish'
  | 'Finnish'
  | 'Czech'
  | 'Greek'
  | 'Hebrew'
  | 'Romanian';

export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o';
export type DeepseekModel = 'deepseek-chat' | 'deepseek-coder';
export type AnthropicModel = 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';

export interface ProviderConfigBase {
  temperature: number;
  maxTokens: number;
  apiKey: string;
}

export interface OpenAIConfig extends ProviderConfigBase {
  model: OpenAIModel;
}

export interface DeepseekConfig extends ProviderConfigBase {
  model: DeepseekModel;
}

export interface AnthropicConfig extends ProviderConfigBase {
  model: AnthropicModel;
}

export interface ProvidersConfig {
  active: 'openai' | 'deepseek' | 'anthropic';
  defaultModel: string;
  openai: OpenAIConfig;
  deepseek: DeepseekConfig;
  anthropic: AnthropicConfig;
}

export interface GitConfig {
  verbose: boolean;
  dryRun: boolean;
  message: string;
  providers: {
    active: string;
    defaultModel: string;
    openai: {
      model: string;
      temperature: number;
      maxTokens: number;
      apiKey: string;
    };
    deepseek: {
      model: string;
      temperature: number;
      maxTokens: number;
      apiKey: string;
    };
    anthropic: {
      model: string;
      temperature: number;
      maxTokens: number;
      apiKey: string;
    };
  };
  stagingMode: string;
  format: string;
  language: string;
  emojiMap: Record<string, string>;
  colorTheme: string;
  autoCommit: boolean;
  autoStage: boolean;
  autoPush: boolean;
  includeProviderInfo: boolean;
  signCommits: boolean;
}

export interface CommitConfig extends GitConfig {
  all?: boolean;
  amend?: boolean;
}

export interface LogConfig extends GitConfig {
  maxCount?: number;
  since?: string;
}

export interface ReleaseConfig extends GitConfig {
  tag?: string;
  prerelease?: boolean;
}

export const defaultConfig: GitConfig = {
  verbose: false,
  dryRun: false,
  message: '',
  providers: {
    active: 'deepseek',
    defaultModel: 'deepseek-chat',
    openai: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2048,
      apiKey: '',
    },
    deepseek: {
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 2048,
      apiKey: '',
    },
    anthropic: {
      model: 'claude-2',
      temperature: 0.7,
      maxTokens: 2048,
      apiKey: '',
    },
  },
  stagingMode: 'ask',
  format: 'conventional',
  language: 'English',
  emojiMap: {},
  colorTheme: 'default',
  autoCommit: false,
  autoStage: false,
  autoPush: false,
  includeProviderInfo: false,
  signCommits: false,
};

export function defineConfig(config: GitConfig): GitConfig {
  return config;
}