type ModelType = 'deepseek' | 'gpt-4o' | 'claude-3.7-sonnet';
type VersioningType = 'semantic' | 'calendar' | 'other';
type TranslateType = 'english' | 'mandarin' | 'hindi' | 'spanish' | 'french' | 'arabic' | 'bengali' | 'russian' | 'portuguese' | 'indonesian' | 'urdu' | 'german' | 'japanese' | 'swahili' | 'marathi' | 'telugu' | 'turkish' | 'tamil' | 'vietnamese' | 'thai';

export type AIConfig = {
  useModel: ModelType;
  deepseek: string;
  'gpt-4o': string;
  'claude-3.7-sonnet': string;
};


interface CommitMessageConfig {
  scope: boolean;
  type: {
    options: string[];
  };
  description: {
    required: boolean;
    maxLength: number;
    format?: 'long' | 'bullet';
  };
  translate: TranslateType;
  instructions?: string;
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
      scope: false,
      type: {
        options: [],
      },
      description: {
        required: true,
        maxLength: 100,
      },
      translate: 'english'
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