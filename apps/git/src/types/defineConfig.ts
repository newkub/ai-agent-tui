export type SupportedLanguage = 'English' | 'Thai' | 'Spanish' | 'French' | 'German' | 'Chinese' | 'Japanese' | 'Korean' | 'Russian' | 'Portuguese' | 'Italian' | 'Dutch' | 'Arabic' | 'Hindi' | 'Turkish' | 'Vietnamese' | 'Polish' | 'Swedish' | 'Norwegian' | 'Danish' | 'Finnish' | 'Czech' | 'Greek' | 'Hebrew' | 'Romanian';

export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo';
export type DeepseekModel = 'deepseek-chat' | 'deepseek-coder';
export type AnthropicModel = 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';

export type ModelType = OpenAIModel | DeepseekModel | AnthropicModel;

export type StagingMode = 'ask' | 'auto' | 'manual';
export type Format = 'conventional' | 'simple' | 'emoji';
export type Strategy = 'semantic' | 'calendar' | 'incremental';
export type AutoMerge = 'squash' | 'rebase' | 'merge';

export type CommitType = 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'chore';

export type CommitScope = string & { __brand: 'CommitScope' };

export interface ModelConfiguration {
  defaultModel: ModelType;
  fallbackChain?: ModelType[];
  providers: ProviderConfig[];
}

export interface LanguageConfiguration {
  language?: SupportedLanguage;
}

export interface ReleaseConfiguration {
  versioning: {
    strategy: 'semantic' | 'calendar' | 'incremental';
    preReleaseTag?: string;
    buildMetadata?: string;
  };
  changelog: {
    template: 'standard' | 'detailed' | 'minimal';
    includeTypes: CommitType[];
    excludeScopes?: string[];
    autoGenerate?: boolean;
  };
  notifications?: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
}

export interface SecurityConfiguration {
  secretScanning?: {
    patterns: string[];
    exclude?: string[];
  };
  encryption?: {
    enable?: boolean;
    keyFile?: string;
    algorithm?: 'aes-256-cbc' | 'aes-192-cbc' | 'aes-128-cbc';
  };
}

export interface ExperimentalConfiguration {
  features?: {
    [feature: string]: {
      enabled?: boolean;
      description?: string;
    };
  };
}

export type ProviderType = 'openai' | 'deepseek' | 'anthropic';

export interface ProviderConfig<T extends ProviderType = ProviderType> {
  provider: T;
  model: T extends 'openai' ? OpenAIModel : T extends 'deepseek' ? DeepseekModel : AnthropicModel;
  temperature?: number;
  maxTokens?: number;
  apiKey: string;
}

export interface CommitValidation {
  message: boolean;
  branchName: boolean;
  allowedBranches: string[];
  allowedTypes: CommitType[];
  scopePattern: string;
}

export interface CommitAutomation {
  autoStage: boolean;
  autoCommit: boolean;
  autoPush: boolean;
  stagingMode: StagingMode;
}

export interface CommitMessage {
  format: Format;
  maxLength: number;
  includeEmoji: boolean;
  translate: {
    enable: boolean;
    targetLang: SupportedLanguage;
  };
  emojiMap: Record<CommitType, string>;
}

export interface CommitConfig {
  validation: CommitValidation;
  automation: CommitAutomation;
  message: CommitMessage;
}

export interface GitHooksConfig {
  preCommit: {
    enable: boolean;
    commands: string[];
    timeout: number;
  };
  commitMsg: {
    enable: boolean;
    pattern: string;
    commands: string[];
    errorMessage: string;
  };
}

export interface GitBranchProtection {
  protected: boolean;
  requiredStatusChecks: string[];
  requiredApprovals: number;
  allowForcePushes: boolean;
}

export interface GitBranchConfig {
  protection: {
    main: GitBranchProtection;
    develop: {
      autoMerge: AutoMerge;
      cleanupAfterMerge: boolean;
      maxStaleDays: number;
    };
  };
  namingConvention: {
    feature: 'feature/*';
    hotfix: 'hotfix/*';
  };
}

export interface GitConfig {
  hooks: GitHooksConfig;
  branch: GitBranchConfig;
}

export interface ReleaseConfig {
  versioning: {
    strategy: 'semantic' | 'calendar' | 'incremental';
    preReleaseTag?: string;
    buildMetadata?: string;
  };
  changelog: {
    template: 'standard' | 'detailed' | 'minimal';
    includeTypes: CommitType[];
    excludeScopes?: string[];
    autoGenerate?: boolean;
  };
  notifications?: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
}

export interface SecurityConfig {
  security: SecurityConfiguration;
}

export interface ExperimentalConfig {
  experimental: ExperimentalConfiguration;
}

export interface GitAssistanceConfig {
  ai: {
    modelConfiguration: ModelConfiguration;
    languageConfiguration: LanguageConfiguration;
    rateLimit: {
      maxRequests: number;
      timeWindow: number;
      alertThreshold: number;
    };
    prompt: {
      systemMessage: string;
      responseFormat: string;
      maxRetry: number;
    };
  };
  commit: CommitConfig;
  git: GitConfig;
  release: ReleaseConfig;
  security: SecurityConfiguration;
  experimental: ExperimentalConfiguration;
}

const defaultConfig: GitAssistanceConfig = {
  ai: {
    modelConfiguration: {
      defaultModel: 'deepseek-chat',
      fallbackChain: ['gpt-3.5-turbo', 'claude-3-haiku'],
      providers: [
        {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 2048,
          apiKey: ''
        },
        {
          provider: 'deepseek',
          model: 'deepseek-chat',
          temperature: 0.7,
          maxTokens: 2048,
          apiKey: ''
        },
        {
          provider: 'anthropic',
          model: 'claude-3-sonnet',
          temperature: 0.7,
          maxTokens: 2048,
          apiKey: ''
        }
      ]
    },
    languageConfiguration: {
      language: 'English'
    },
    rateLimit: {
      maxRequests: 100,
      timeWindow: 3600,
      alertThreshold: 80
    },
    prompt: {
      systemMessage: 'You are a helpful assistant.',
      responseFormat: 'markdown',
      maxRetry: 3
    }
  },
  commit: {
    validation: {
      message: true,
      branchName: true,
      allowedBranches: ['main', 'develop'],
      allowedTypes: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
      scopePattern: '[a-z]+([a-z-]+)?: .+$'
    },
    automation: {
      autoStage: true,
      autoCommit: true,
      autoPush: true,
      stagingMode: 'auto'
    },
    message: {
      format: 'conventional',
      maxLength: 100,
      includeEmoji: true,
      translate: {
        enable: false,
        targetLang: 'English'
      },
      emojiMap: {
        feat: '✨',
        fix: '🐛',
        docs: '📚',
        style: '💄',
        refactor: '♻️',
        perf: '⚡️',
        test: '✅',
        chore: '🔧'
      }
    }
  },
  git: {
    hooks: {
      preCommit: {
        enable: true,
        commands: ['npm run lint', 'npm run test'],
        timeout: 30000
      },
      commitMsg: {
        enable: true,
        pattern: '^[a-z]+([a-z-]+)?: .+$',
        commands: [],
        errorMessage: 'Invalid commit message format'
      }
    },
    branch: {
      protection: {
        main: {
          protected: true,
          requiredStatusChecks: ['lint', 'test'],
          requiredApprovals: 1,
          allowForcePushes: false
        },
        develop: {
          autoMerge: 'squash',
          cleanupAfterMerge: true,
          maxStaleDays: 7
        }
      },
      namingConvention: {
        feature: 'feature/*',
        hotfix: 'hotfix/*'
      }
    }
  },
  release: {
    versioning: {
      strategy: 'semantic',
      preReleaseTag: 'beta'
    },
    changelog: {
      template: 'standard',
      includeTypes: ['feat', 'fix'],
      autoGenerate: true
    },
    notifications: {
      slack: 'https://hooks.slack.com/services/...',
      email: ['team@example.com']
    }
  },
  security: {
    secretScanning: {
      patterns: ['API_KEY', 'SECRET_KEY'],
      exclude: ['test/**']
    },
    encryption: {
      enable: true,
      keyFile: 'encryption.key',
      algorithm: 'aes-256-cbc'
    }
  },
  experimental: {
    features: {
      'ai-code-review': {
        enabled: true,
        description: 'Enable AI-powered code review'
      }
    }
  }
};

function defineConfig(config: GitAssistanceConfig): GitAssistanceConfig {
  return config;
}

export { defaultConfig, defineConfig };