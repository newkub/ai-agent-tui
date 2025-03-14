// Git primitive types
export type GitHash = string;
export type GitRemote = string;
export type GitBranch = string;
export type GitMessage = string;
export type GitTag = string;
export type GitAuthor = {
  name: string;
  email: string;
};
export type GitFilePath = string;

// Utility types
export type NonEmptyString<T extends string> = T extends '' ? never : T;
export type PositiveNumber = number & { __positive: true };

// Git date formats
export type GitDateISO = string; // ISO 8601
export type GitDateUnix = number; // Unix timestamp
export type GitDateRelative = string; // e.g. '2 days ago'

// Git error handling
export type GitErrorCode = number;
export type GitErrorMessage = string;
export type GitCommandName = 
  | 'init'
  | 'clone'
  | 'add'
  | 'commit'
  | 'push'
  | 'pull'
  | 'fetch'
  | 'merge'
  | 'rebase'
  | 'checkout'
  | 'branch'
  | 'tag'
  | 'status'
  | 'log'
  | 'diff'
  | 'reset'
  | 'revert'
  | 'stash';

export type GitError = {
  code: GitErrorCode;
  message: GitErrorMessage;
  command: GitCommandName;
};

// Git command options
export type GitLogFormat = 'oneline' | 'short' | 'medium' | 'full' | 'fuller' | 'reference' | 'email' | 'raw';

export type GitCommandOptions = {
  workingDir?: string;
  remote?: GitRemote;
  branch?: NonEmptyString<GitBranch>;
  message?: NonEmptyString<GitMessage>;
  tag?: NonEmptyString<GitTag>;
  author?: GitAuthor;
  date?: GitDateISO;
  logFormat?: GitLogFormat;
  noVerify?: boolean;
  force?: boolean;
};

// Validation types
export type ValidGitHash = string & { __validHash: true };
export type ValidGitPath = string & { __validPath: true };

// Git command result
export type GitCommandResult<T> =
  | { success: true; data: T }
  | { success: false; error: GitError };

// Changelog types
export interface ChangelogOptions {
  template: string;
  includeTypes: string[];
}

export interface ChangelogEntry {
  type: string;
  message: string;
  hash: string;
  date: string;
}

// Git objects
export type Commit = {
  hash: GitHash;
  message: GitMessage;
  author: GitAuthor;
  date: GitDateISO;
  parentHashes?: GitHash[];
  branch?: GitBranch;
  tags?: GitTag[];
};

export type GitFileStatus = 'added' | 'modified' | 'deleted' | 'renamed' | 'copied' | 'untracked' | 'ignored';

export type GitStatusFile = {
  path: GitFilePath;
  status: GitFileStatus;
  oldPath?: GitFilePath; // For renamed files
};

export type GitStatus = {
  staged: GitStatusFile[];
  modified: GitStatusFile[];
  untracked: GitStatusFile[];
  branch: GitBranch;
  ahead: number;
  behind: number;
};

// Generic result type
export type ExecuteResult<T> = {
  success: boolean;
  data?: T;
  error?: GitError;
  warnings?: string[];
};

// Git-related commands
export interface GitCommit {
  message: string;
  author: string;
  date: string;
}

export interface GitStagedFile {
  path: string;
  status: string;
}

export interface GitBranchInfo {
  name: string;
  isCurrent: boolean;
}
