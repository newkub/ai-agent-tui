import pc from 'picocolors';
import { select, isCancel, outro } from '@clack/prompts';
import { commit, log, release, branch } from './commands';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

const execPromise = promisify(execCallback);

const runCommand = async (command: string): Promise<string> => {
  try {
    const { stdout } = await execPromise(command);
    return stdout.trim();
  } catch (error) {
    return '';
  }
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
};

const formatCommitStatus = (commit: any) => {
  const maxLength = process.stdout.columns - 20; // Leave room for prefix and padding
  const message = truncateText(commit, maxLength);
  return `Commit Message: ${message}`;
};

async function getGitStatus() {
  try {
    const commit = await runCommand('git log -1 --pretty=format:"%s (%ad)" --date=short');
    const branch = await runCommand('git branch --show-current');
    const tag = await runCommand('git describe --tags --abbrev=0 2>/dev/null') || 'No tags';

    return { commit, branch, tag };
  } catch (error) {
    console.error(pc.red('Error getting git status:'));
    console.error(error);
    return { commit: 'No commits', branch: 'No branch', tag: 'No tags' };
  }
}

async function main(): Promise<void> {
  try {
    console.log(`\n${pc.magenta('🚀')} ${pc.bold(pc.cyan('Git Assistance'))} ${pc.magenta('✨')}`);
    console.log(`${pc.dim(pc.italic('Ready to enhance your Git workflow with AI assistance'))}`);
    
    // Get git repository status
    const gitStatus = await getGitStatus();

    // Define command options
    const maxLength = process.stdout.columns - 20; // Leave room for prefix and padding
    const commitMessage = truncateText(gitStatus.commit, maxLength);
    const tag = truncateText(gitStatus.tag, maxLength);
    const branch = truncateText(gitStatus.branch, maxLength);

    const options = [
      { value: 'commit', label: `✨ Commit        ${pc.dim(commitMessage)}` },
      { value: 'log', label: `📝 Log           ${pc.dim(commitMessage)}` },
      { value: 'release', label: `🚀 Release       ${pc.dim(tag)}` },
      { value: 'branch', label: `🌿 Branch        ${pc.dim(branch)}` }
    ];
    
    // Prompt user to select a command
    const command = await select({
      message: 'Select a command',
      options: options
    });

    if (isCancel(command)) {
      outro('Operation cancelled');
      process.exit(0);
    }

    if (!command) {
      throw new Error('No selection was made');
    }

    // Execute selected command
    const commandMap = {
      commit,
      log,
      release,
      branch
    };
    
    await commandMap[command as keyof typeof commandMap]();
  } catch (error) {
    console.error(pc.red('Failed to initialize:'), error);
    process.exit(1);
  }
}

main();
