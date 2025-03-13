import { getCurrentBranch, getStagedFiles, createCommit, push } from '@newkub/git';
import type { CommandHandler } from '../types/command';
import config from '../../git-assistance.config';
import { generateCommitMessage } from '@newkub/ai';
import { select, isCancel } from '@clack/prompts';

const validateBranch = async (): Promise<boolean> => {
  const currentBranch = await getCurrentBranch();
  const allowedBranches = config.git.branch.protection.main.protected 
    ? ['main'] 
    : config.commit.validation.allowedBranches;

  if (!allowedBranches.includes(currentBranch)) {
    console.error(`Error: Branch '${currentBranch}' is not allowed for commits.`);
    return false;
  }
  return true;
};

const validateCommitMessage = (message: string): boolean => {
  const { validation } = config.commit;
  if (!validation.message) return true;

  const typePattern = new RegExp(`^(${validation.allowedTypes.join('|')})`);
  const scopePattern = new RegExp(validation.scopePattern);

  return typePattern.test(message) && scopePattern.test(message);
};

const pushToRemote = async () => {
  const result = await push();
  return { 
    success: result.success, 
    message: result.success ? 'Pushed to remote successfully' : 'Failed to push to remote'
  };
};

const commit: CommandHandler = async () => {
  // Get current branch
  const currentBranch = await getCurrentBranch();
  console.log(`Current branch: ${currentBranch}`);

  // Validate branch
  if (!await validateBranch()) {
    return {
      success: false,
      message: 'Cannot commit directly to protected branch'
    };
  }

  // Check staged files
  const stagedFiles = await getStagedFiles();
  
  // If no staged files, ask if user wants to stage all
  if (!stagedFiles.length) {
    const stageAll = await select({
      message: 'No staged files found. Would you like to:',
      options: [
        { value: 'stage', label: 'Stage all files' },
        { value: 'cancel', label: 'Cancel commit' },
      ],
    });

    if (isCancel(stageAll) || stageAll === 'cancel') {
      console.log('Commit cancelled');
      return {
        success: false,
        message: 'Commit cancelled'
      };
    }

    if (stageAll === 'stage') {
      // Implementation to stage all files
      // await stageAllFiles();
      console.log('Staging all files...');
    }
  } else {
    console.log(`Staged files: ${stagedFiles.join(', ')}`);
  }

  // Run pre-commit hooks
  if (config.git.hooks.preCommit.enable) {
    for (const command of config.git.hooks.preCommit.commands) {
      // Implementation of command execution
    }
  }

  // Generate AI commit message
  const message = await generateCommitMessage(`Generate commit message for these changes: ${stagedFiles.join(', ')}`);

  // Validate commit message
  if (config.commit.validation.message) {
    const isValid = validateCommitMessage(message);
    if (!isValid) {
      return {
        success: false,
        message: 'Invalid commit message'
      };
    }
  }

  // Auto stage changes
  if (config.commit.automation.autoStage) {
    // Implementation of command execution
  }

  // Create commit
  await createCommit(message);
  console.log(`Commit created: ${message}`);

  // Auto push changes
  if (config.commit.automation.autoPush) {
    console.log('Auto-pushing to remote...');
    await pushToRemote();
  } else {
    const shouldPush = await select({
      message: 'Would you like to push to remote?',
      options: [
        { value: 'yes', label: 'Yes, push now' },
        { value: 'no', label: 'No, I\'ll push later' },
      ],
    });

    if (!isCancel(shouldPush) && shouldPush === 'yes') {
      await pushToRemote();
    }
  }

  return {
    success: true,
    message: `Commit created with message: ${message}`
  };
};

export default commit;