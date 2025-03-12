// Define the schema for the configurati

// Define supported languages for autocomplete
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

interface GitConfig {
  autoCommit: boolean;
  autoStage: boolean;
  stagingMode: 'ask' | 'all' | 'ai' | 'manual';
  autoPush: boolean;
  includeProviderInfo: boolean;
  remoteBranch?: string;
  signCommits: boolean;
}

interface CommitMessageConfig {
  maxLength: number;
  includeEmoji: boolean;
  format: 'conventional' | 'simple';
  scope?: string;
  defaultScope?: string;
  emojiMap?: Record<string, string>;
  capitalize: boolean;
  addPeriod: boolean;
  language: SupportedLanguage; // Updated to use SupportedLanguage type
  askLanguage: boolean; // Whether to ask for language selection each time
}

interface UIConfig {
  showDiffSummary: boolean;
  confirmCommit: boolean;
  confirmPush: boolean;
  colorTheme: 'default' | 'dark' | 'light';
}

// Model types for autocomplete
export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o';
export type DeepseekModel = 'deepseek-chat' | 'deepseek-coder';
export type AnthropicModel = 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';

// Provider-specific configurations
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

export interface AicommitConfig {
  providers: ProvidersConfig;
  git: GitConfig;
  commitMessage: CommitMessageConfig;
  ui: UIConfig;
}

export const defaultConfig: AicommitConfig = {
  providers: {
    active: 'deepseek',
    defaultModel: 'deepseek-chat',
    openai: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 500,
      apiKey: process.env.OPENAI_API_KEY || ""
    },
    deepseek: {
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 500,
      apiKey: process.env.DEEPSEEK_API_KEY || ""
    },
    anthropic: {
      model: 'claude-3-opus',
      temperature: 0.7,
      maxTokens: 500,
      apiKey: process.env.ANTHROPIC_API_KEY || ""
    }
  },
  git: {
    autoCommit: false,
    autoStage: false,
    stagingMode: 'ask',
    autoPush: false,
    includeProviderInfo: false,
    signCommits: false
  },
  commitMessage: {
    maxLength: 72,
    includeEmoji: true,
    format: 'conventional',
    capitalize: true,
    addPeriod: false,
    language: 'English', // Default language for commit messages
    askLanguage: false, // Default to ask for language selection
    emojiMap: {
      feat: '✨',
      fix: '🐛',
      docs: '📚',
      style: '💎',
      refactor: '♻️',
      perf: '🚀',
      test: '🧪',
      build: '🛠️',
      ci: '⚙️',
      chore: '🧹',
      revert: '⏪'
    }
  },
  ui: {
    showDiffSummary: true,
    confirmCommit: true,
    confirmPush: true,
    colorTheme: 'default'
  }
};

// Helper function to get the active provider configuration
export function getActiveProvider(config: AicommitConfig): 'openai' | 'deepseek' | 'anthropic' {
  return config.providers.active;
}

// Helper function to get the appropriate API key based on provider
export function getApiKeyForProvider(config: AicommitConfig): string {
  const provider = getActiveProvider(config);
  
  if (provider === 'openai') {
    return config.providers.openai.apiKey || process.env.OPENAI_API_KEY || "";
  } if (provider === 'deepseek') {
    return config.providers.deepseek.apiKey || process.env.DEEPSEEK_API_KEY || "";
  } if (provider === 'anthropic') {
    return config.providers.anthropic.apiKey || process.env.ANTHROPIC_API_KEY || "";
  }
  
  return "";
}

// Helper function to get the current provider configuration
export function getProviderConfig(config: AicommitConfig): ProviderConfigBase & { model: string } {
  const provider = getActiveProvider(config);
  
  if (provider === 'openai') {
    return config.providers.openai;
  } if (provider === 'deepseek') {
    return config.providers.deepseek;
  } if (provider === 'anthropic') {
    return config.providers.anthropic;
  }
  
  throw new Error(`Provider configuration for ${provider} not found`);
}

// Helper function to get all supported languages
export function getSupportedLanguages(): SupportedLanguage[] {
  return [
    'English',
    'Thai',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Russian',
    'Portuguese',
    'Italian',
    'Dutch',
    'Arabic',
    'Hindi',
    'Turkish',
    'Vietnamese',
    'Polish',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Czech',
    'Greek',
    'Hebrew',
    'Romanian'
  ];
}

export async function loadConfig(): Promise<AicommitConfig> {
  try {
    const userConfig = await import(`${process.cwd()}/git-ai-assistance.config.ts`);

    const mergedConfig: AicommitConfig = {
      ...defaultConfig,
      ...userConfig.default,
      providers: {
        ...defaultConfig.providers,
        ...userConfig.default?.providers,
        openai: {
          ...defaultConfig.providers.openai,
          ...userConfig.default?.providers?.openai
        },
        deepseek: {
          ...defaultConfig.providers.deepseek,
          ...userConfig.default?.providers?.deepseek
        },
        anthropic: {
          ...defaultConfig.providers.anthropic,
          ...userConfig.default?.providers?.anthropic
        }
      },
      git: {
        ...defaultConfig.git,
        ...userConfig.default?.git
      },
      commitMessage: {
        ...defaultConfig.commitMessage,
        ...userConfig.default?.commitMessage,
        emojiMap: {
          ...defaultConfig.commitMessage.emojiMap,
          ...userConfig.default?.commitMessage?.emojiMap
        }
      },
      ui: {
        ...defaultConfig.ui,
        ...userConfig.default?.ui
      }
    };

    // Ensure API keys from environment variables are used if available
    if (process.env.OPENAI_API_KEY && mergedConfig.providers.openai) {
      mergedConfig.providers.openai.apiKey = process.env.OPENAI_API_KEY;
    }
    
    if (process.env.DEEPSEEK_API_KEY && mergedConfig.providers.deepseek) {
      mergedConfig.providers.deepseek.apiKey = process.env.DEEPSEEK_API_KEY;
    }

    if (process.env.ANTHROPIC_API_KEY && mergedConfig.providers.anthropic) {
      mergedConfig.providers.anthropic.apiKey = process.env.ANTHROPIC_API_KEY;
    }

    return mergedConfig;
  } catch (error) {
    console.warn('Failed to load user config, using default config:', error);
    return defaultConfig;
  }
}
