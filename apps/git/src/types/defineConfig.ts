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

interface MessageConfig {
  scope: string;
  type: string;
  description: string;
  emoji: string;
  maxLength: number;
  translate: string;
  bulletPoints: boolean;
  prefix?: string;
}

interface CommitConfig {
  mode: 'aicommit' | 'manual';
  askMode: boolean;
  askStage: boolean;
  askConfirm: boolean;
  askPush: boolean;
  message: MessageConfig;
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
      scope: '',
      type: '',
      description: '',
      emoji: '',
      maxLength: 100,
      translate: 'English',
      bulletPoints: false
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