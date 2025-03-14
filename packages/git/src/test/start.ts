import { cliui } from '@poppinss/cliui';
import pc from 'picocolors';
import * as git from '../index';

const ui = cliui();
const instructions = ui.instructions();

async function showGitExamples() {
  try {
    // Basic git info
    const branch = await git.getCurrentBranch();
    instructions.add(`getCurrentBranch: ${pc.green(branch ?? 'No branch')}`);

    const commits = await git.getCommits(3);
    instructions.add(`getCommits (last 3): ${pc.green(commits.length > 0 ? `${commits.length} commits` : 'No commits found')}`);

    const history = await git.getCommitHistory(2);
    instructions.add(`getCommitHistory (last 2): ${pc.green(history && history.length > 0 ? `${history.length} commits` : 'No commits found')}`);

    const tag = await git.getLatestTag();
    instructions.add(`getLatestTag: ${tag.success ? pc.green(tag.data || 'No tags found') : pc.yellow('No tags found')}`);

    // Git status
    const status = await git.status();
    instructions.add(`status: ${pc.green(`Branch: ${status.branch}, Ahead: ${status.ahead}, Behind: ${status.behind}, Modified: ${status.modified.length}, Staged: ${status.staged.length}, Untracked: ${status.untracked.length}`)}`);

    const staged = await git.getStagedFiles();
    instructions.add(`getStagedFiles: ${pc.green(staged.length ? `${staged.length} files` : 'No staged files')}`);

    // Git log
    const logHistory = await git.getLogHistory({ logFormat: 'full' });
    instructions.add(`getLogHistory: ${pc.green(logHistory.length ? `${logHistory.length} commits` : 'No commits found')}`);

    // Git config
    const author = await git.getAuthor();
    const authorDisplay = author.success && author.data ? 
      `${author.data.name} <${author.data.email}>` : 
      'Not configured';
    instructions.add(`getAuthor: ${author.success ? pc.green(authorDisplay) : pc.yellow('Not configured')}`);

    const configEmail = await git.getConfig('user.email');
    const emailDisplay = configEmail.success ? (configEmail.data ?? 'Not configured') : 'Not configured';
    instructions.add(`getConfig (user.email): ${configEmail.success ? pc.green(emailDisplay) : pc.yellow('Not configured')}`);

  } catch (error) {
    console.error('Error running examples:', error);
  }

  instructions.render();
}

showGitExamples().catch(console.error);
