// Repository Operations
export { init, execute } from './commands/init';

// Commit Operations
export { createCommit, getCommitHistory, getCommits, checkoutCommit, showCommitDiff } from './commands/commit';

// Branch Operations
export { getAllBranches, getLocalBranches, getCurrentBranch, checkoutBranch, mergeBranch, deleteBranch, branchFromCommit } from './commands/branch';

// File Operations
export { add, rm, getStagedFiles, getFileStatus, getFileChanges } from './commands/file';

// Configuration
export { getConfig, setConfig } from './commands/config';

// Versioning
export { getLatestTag, bumpVersion, generateChangelog } from './commands/version';
