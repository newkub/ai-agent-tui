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

export type ModelType = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'deepseek-chat' | 'deepseek-coder' | 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';

export type StagingMode = 'ask' | 'auto' | 'manual';
export type Format = 'conventional' | 'simple' | 'emoji';
export type Strategy = 'semantic' | 'calendar' | 'incremental';
export type AutoMerge = 'squash' | 'rebase' | 'merge';

export type CommitType = 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'chore';

export type CommitScope = string & { __brand: 'CommitScope' };

export interface CommitMessageFormat {
  type: CommitType;
  scope?: CommitScope;
  subject: string;
  body?: string;
  footer?: string;
  breakingChange?: boolean;
}

/**
 * Model configuration interface.
 */
export interface ModelConfiguration {
  /**
   * Default model to use.
   */
  defaultModel: ModelType;
  /**
   * Fallback models in case of failure.
   */
  fallbackChain?: ModelType[];
  /**
   * Model-specific configurations.
   */
  models?: {
    [key in ModelType]: {
      /**
       * API key for the model.
       */
      apiKey?: string;
      /**
       * Temperature for the model.
       */
      temperature?: number;
      /**
       * Maximum tokens for the model.
       */
      maxTokens?: number;
      /**
       * Timeout for the model.
       */
      timeout?: number;
    };
  };
}

/**
 * Language configuration interface.
 */
export interface LanguageConfiguration {
  /**
   * Selected language (default: 'English').
   */
  language?: SupportedLanguage;
}

export interface ReleaseConfiguration {
  /** Versioning strategy */
  versioning: {
    strategy: 'semantic' | 'calendar' | 'incremental';
    /** Pre-release tag */
    preReleaseTag?: string;
    /** Build metadata */
    buildMetadata?: string;
  };
  /** Changelog configuration */
  changelog: {
    template: 'standard' | 'detailed' | 'minimal';
    includeTypes: CommitType[];
    excludeScopes?: string[];
    /** Automatically generate changelog */
    autoGenerate?: boolean;
  };
  /** Notification settings */
  notifications?: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
}

export interface SecurityConfiguration {
  /** Secret scanning patterns */
  secretScanning?: {
    patterns: string[];
    exclude?: string[];
  };
  /** Encryption settings */
  encryption?: {
    enable?: boolean;
    keyFile?: string;
    algorithm?: 'aes-256-cbc' | 'aes-192-cbc' | 'aes-128-cbc';
  };
}

export interface ExperimentalConfiguration {
  /** Experimental feature flags */
  features?: {
    [feature: string]: {
      enabled?: boolean;
      description?: string;
    };
  };
}

export interface ProviderConfig<T extends ModelType> {
  model: T;
  temperature?: number;
  maxTokens?: number;
  apiKey: string;
}

export interface ProvidersConfig {
  active: 'openai' | 'deepseek' | 'anthropic';
  defaultModel: ModelType;
  openai?: ProviderConfig<'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o'>;
  deepseek?: ProviderConfig<'deepseek-chat' | 'deepseek-coder'>;
  anthropic?: ProviderConfig<'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'>;
}

export interface GitConfig {
  providers: ProvidersConfig;
  stagingMode?: string;
  format?: string;
  language?: string;
  emojiMap?: Record<string, string>;
  colorTheme?: string;
  autoCommit?: boolean;
  autoStage?: boolean;
  autoPush?: boolean;
  includeProviderInfo?: boolean;
  signCommits?: boolean;
}

export interface AIConfig {
  modelConfiguration: ModelConfiguration;
  languageConfiguration: LanguageConfiguration;
  rateLimit: {
    /** Maximum requests per time window */
    maxRequests: number;
    /** Time window in seconds */
    timeWindow: number;
    /** Alert threshold percentage */
    alertThreshold: number;
  };
  prompt: {
    /** System message for the AI */
    systemMessage: string;
    /** Format for AI responses */
    responseFormat: 'markdown' | 'plaintext';
    /** Maximum retry attempts */
    maxRetry: number;
  };
  providers: {
    openai: ProviderConfig<'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o'>;
    deepseek: ProviderConfig<'deepseek-chat' | 'deepseek-coder'>;
    anthropic: ProviderConfig<'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'>;
  };
}

export interface CommitConfig {
  validation: {
    /** Validate commit messages */
    message: boolean;
    /** Validate branch names */
    branchName: boolean;
    /** Allowed branch patterns */
    allowedBranches: string[];
    /** Allowed commit types */
    allowedTypes: CommitType[];
    /** Scope pattern validation */
    scopePattern: string;
  };
  automation: {
    /** Automatically stage changes */
    autoStage: boolean;
    /** Automatically commit changes */
    autoCommit: boolean;
    /** Automatically push changes */
    autoPush: boolean;
    /** Staging mode */
    stagingMode: StagingMode;
  };
  message: {
    /** Commit message format */
    format: Format;
    /** Maximum commit message length */
    maxLength: number;
    /** Include emoji in commit messages */
    includeEmoji: boolean;
    translate: {
      /** Enable commit message translation */
      enable: boolean;
      /** Target language for translation */
      targetLang: string;
    };
    /** Emoji map for commit types */
    emojiMap: Record<string, string>;
  };
}

export interface BranchProtection {
  /** Whether the branch is protected */
  protected: boolean;
  /** Required status checks to pass before merging */
  requiredStatusChecks: string[];
  /** Number of required approvals */
  requiredApprovals: number;
  /** Allow force pushes to this branch */
  allowForcePushes: boolean;
}

export interface HookCommand {
  /** Command to execute */
  command: string;
  /** Working directory for the command */
  cwd?: string;
  /** Environment variables */
  env?: Record<string, string>;
  /** Timeout in milliseconds */
  timeout?: number;
}

export interface BaseHookConfig {
  enable: boolean;
  commands: (string | HookCommand)[];
  timeout?: number;
}

export interface CommitMsgHookConfig extends BaseHookConfig {
  pattern: string;
  errorMessage?: string;
}

export interface GitHooksConfig {
  preCommit: BaseHookConfig;
  commitMsg: CommitMsgHookConfig;
  [hookName: string]: BaseHookConfig | CommitMsgHookConfig;
}

export interface BranchConfig {
  protection: {
    main: BranchProtection;
    develop: {
      autoMerge: AutoMerge;
      cleanupAfterMerge: boolean;
      maxStaleDays: number;
    };
  };
  namingConvention: {
    feature: string;
    hotfix: string;
  };
}

export interface ReleaseConfig {
  release: ReleaseConfiguration;
}

export interface SecurityConfig {
  security: SecurityConfiguration;
}

export interface ExperimentalConfig {
  experimental: ExperimentalConfiguration;
}

export interface GitAssistanceConfig {
  ai: AIConfig;
  commit: CommitConfig;
  git: {
    hooks: GitHooksConfig;
    branch: BranchConfig;
  };
  release: ReleaseConfig;
  security: SecurityConfig;
  experimental: ExperimentalConfig;
}

export const defaultConfig: GitAssistanceConfig = {
  ai: {
    modelConfiguration: {
      defaultModel: 'deepseek-chat',
      fallbackChain: ['deepseek-chat', 'gpt-4o', 'claude-3-sonnet'],
      models: {
        'gpt-3.5-turbo': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'gpt-4': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'gpt-4-turbo': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'gpt-4o': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'deepseek-chat': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'deepseek-coder': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'claude-3-opus': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'claude-3-sonnet': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
        'claude-3-haiku': {
          apiKey: '',
          temperature: 0.7,
          maxTokens: 2048,
          timeout: 10000,
        },
      },
    },
    languageConfiguration: {
      language: 'English',
    },
    rateLimit: {
      maxRequests: 100,
      timeWindow: 3600,
      alertThreshold: 80,
    },
    prompt: {
      systemMessage: 'You are a helpful assistant.',
      responseFormat: 'markdown',
      maxRetry: 3,
    },
    providers: {
      openai: {
        model: 'gpt-4',
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
        model: 'claude-3-sonnet',
        temperature: 0.7,
        maxTokens: 2048,
        apiKey: '',
      },
    },
  },
  commit: {
    validation: {
      message: true,
      branchName: true,
      allowedBranches: ['main', 'develop', 'feature/*', 'hotfix/*'],
      allowedTypes: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
      scopePattern: '[a-z]+(-[a-z]+)*',
    },
    automation: {
      autoStage: true,
      autoCommit: true,
      autoPush: true,
      stagingMode: 'ask',
    },
    message: {
      format: 'conventional',
      maxLength: 100,
      includeEmoji: true,
      translate: {
        enable: false,
        targetLang: 'English',
      },
      emojiMap: {
        feat: '✨',
        fix: '🐛',
        docs: '📚',
        style: '💄',
        refactor: '♻️',
        perf: '⚡️',
        test: '✅',
        chore: '🔧',
      },
    },
  },
  git: {
    hooks: {
      preCommit: {
        enable: true,
        commands: ['lint-staged'],
        timeout: 10000
      },
      commitMsg: {
        enable: true,
        pattern: '^[A-Z]+-[0-9]+: .+',
        commands: [],
        errorMessage: 'Commit message must follow the pattern: JIRA-123: description'
      }
    },
    branch: {
      protection: {
        main: {
          protected: true,
          requiredStatusChecks: ['test', 'lint'],
          requiredApprovals: 1,
          allowForcePushes: false,
        },
        develop: {
          autoMerge: 'squash',
          cleanupAfterMerge: true,
          maxStaleDays: 30,
        },
      },
      namingConvention: {
        feature: 'feature/*',
        hotfix: 'hotfix/*',
      },
    },
  },
  release: {
    release: {
      versioning: {
        strategy: 'semantic',
        preReleaseTag: 'beta',
      },
      changelog: {
        template: 'standard',
        includeTypes: ['feat', 'fix', 'perf'],
        excludeScopes: ['docs', 'style'],
        autoGenerate: true,
      },
      notifications: {
        slack: '',
        email: [],
        webhook: '',
      },
    },
  },
  security: {
    security: {
      secretScanning: {
        patterns: ['apiKey', 'secret'],
        exclude: ['node_modules'],
      },
      encryption: {
        enable: false,
        keyFile: '',
        algorithm: 'aes-256-cbc',
      },
    },
  },
  experimental: {
    experimental: {
      features: {
        autoCodeReview: {
          enabled: false,
          description: 'Automatically review code for best practices',
        },
        autoFix: {
          enabled: false,
          description: 'Automatically fix common code issues',
        },
      },
    },
  },
};

function validateConfig(config: GitAssistanceConfig): void {
  if (!config.ai.modelConfiguration.defaultModel) {
    throw new Error('Default model is required');
  }
  if (!config.commit.validation.allowedTypes.length) {
    throw new Error('At least one commit type is required');
  }
  if (!config.git.branch.protection.main.protected) {
    throw new Error('Main branch protection is required');
  }
}

export function defineConfig(config: GitAssistanceConfig): GitAssistanceConfig {
  validateConfig(config);
  return config;
}