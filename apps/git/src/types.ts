import type { AicommitConfig } from './git-ai-assistance.config';
import type { StatusResult } from 'simple-git';

// Git diff information
export interface GitDiff {
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    diff: string;
  }[];
  summary: {
    additions: number;
    deletions: number;
    files: number;
  };
}

// Git command context
export interface GitCommandContext {
  query: string;
  currentBranch: string;
  status: StatusResult;
}

// Git command response
export interface GitCommandResponse {
  command: string;
  explanation?: string;
}

// Commit group suggestion
export interface CommitGroup {
  description: string;
  files: string[];
  reason?: string;
}

// Staging suggestion
export interface StagingSuggestion {
  files: string[];
  reason: string;
}

// AI provider interface
export interface AiProvider {
  generateCommitMessage(diff: GitDiff, config: AicommitConfig, customPrompt?: string): Promise<string>;
  generateGitCommand(context: GitCommandContext, config: AicommitConfig): Promise<GitCommandResponse>;
  suggestCommitGroups(diff: GitDiff, config: AicommitConfig): Promise<CommitGroup[]>;
  suggestStaging(diff: GitDiff, config: AicommitConfig): Promise<StagingSuggestion>;
  improveCommitMessage(userMessage: string, diff: GitDiff, config: AicommitConfig): Promise<string>;
}

// Response from the AI provider
export interface AiResponse {
  message: string;
  provider: string;
  model: string;
}
