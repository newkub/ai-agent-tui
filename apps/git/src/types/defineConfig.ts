type ModelType = 'deepseek' | 'gpt-4o' | 'claude-3.7-sonnet';
type VersioningType = 'semantic' | 'calendar' | 'other';

export type AIConfig = {
  useModel: ModelType;
  deepseek: string;
  'gpt-4o': string;
  'claude-3.7-sonnet': string;
};

interface ProviderConfig {
  ai: AIConfig;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

interface CommitMessageConfig {
  scope: {
    required: boolean;
    description: string;
  };
  type: {
    options: string[];
    description: string;
  };
  description: {
    required: boolean;
    maxLength: number;
    description: string;
  };
  emoji: {
    enabled: boolean;
    description: string;
  };
  bulletPoints: {
    enabled: boolean;
    maxItems: number;
    description: string;
  };
  translate: {
    enabled: boolean;
    description: string;
  };
}

interface CommitConfig {
  mode: 'aicommit' | 'manual';
  askMode: boolean;
  askStage: boolean;
  askConfirm: boolean;
  askPush: boolean;
  message: CommitMessageConfig;
}

interface HooksConfig {
  preCommit: string;
  postCommit: string;
}

interface ReleaseConfig {
  generateChangelog: boolean;
  versioning: VersioningType;
  publish: string;
}

export interface GitAssistanceConfig {
  ai: AIConfig;
  commit: CommitConfig;
  commitMessage?: {
    emoji: boolean;
    scope: boolean;
    type: boolean;
    bulletPoints: boolean;
  };
  hooks: HooksConfig;
  release: ReleaseConfig;
}

export const defaultConfig: GitAssistanceConfig = {
  ai: {
    useModel: 'deepseek',
    deepseek: '',
    'gpt-4o': '',
    'claude-3.7-sonnet': ''
  },
  commit: {
    mode: 'aicommit',
    askMode: true,
    askStage: true,
    askConfirm: false,
    askPush: false,
    message: {
      scope: {
        required: false,
        description: ''
      },
      type: {
        options: [],
        description: ''
      },
      description: {
        required: true,
        maxLength: 100,
        description: ''
      },
      emoji: {
        enabled: true,
        description: ''
      },
      bulletPoints: {
        enabled: false,
        maxItems: 0,
        description: ''
      },
      translate: {
        enabled: true,
        description: ''
      }
    }
  },
  hooks: {
    preCommit: 'npm run lint',
    postCommit: ''
  },
  release: {
    generateChangelog: true,
    versioning: 'semantic',
    publish: ''
  }
};

export function defineConfig(config: GitAssistanceConfig): GitAssistanceConfig {
  return config;
}