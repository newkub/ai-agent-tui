import { execute } from './commands/execute';
import { getCurrentBranch } from './commands/getCurrentBranch';
import { getCommitHistory } from './commands/getCommitHistory';
import { getCommits } from './commands/getCommits';
import { getLatestTag } from './commands/getLatestTag';
import { getStagedFiles } from './commands/getStagedFiles';
import { createCommit } from './commands/createCommit';
import { init } from './commands/init';
import { add } from './commands/add';
import { rm } from './commands/rm';
import { getConfig, setConfig } from './commands/config';
import { generateChangelog } from './commands/changelog';
import { status } from './commands/status';

export {
  execute,
  getCurrentBranch,
  getCommitHistory,
  getCommits,
  getLatestTag,
  getStagedFiles,
  createCommit,
  init,
  add,
  rm,
  getConfig,
  setConfig,
  generateChangelog,
  status
};
