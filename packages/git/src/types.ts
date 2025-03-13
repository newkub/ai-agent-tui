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
  branch?: GitBranch;
  message?: GitMessage;
  tag?: GitTag;
  author?: GitAuthor;
  date?: GitDateISO;
  logFormat?: GitLogFormat;
  noVerify?: boolean;
  force?: boolean;
};

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
