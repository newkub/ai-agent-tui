import { intro, outro, text, isCancel, cancel } from '@clack/prompts';
import { generateCommitMessage } from '@newkub/ai';
import { getCurrentBranch, getStagedFiles, createCommit } from '@newkub/git';
import type { CommandHandler } from '../types/command';

const commit: CommandHandler = async () => {
  intro('Git AI Commit Assistant');

  const stagedFiles = await getStagedFiles();
  const currentBranch = await getCurrentBranch();

  if (!stagedFiles.length) {
    return {
      success: false,
      message: 'No staged files found. Please stage your changes first.'
    };
  }

  const message = await text({
    message: 'Commit message',
    placeholder: await generateCommitMessage(stagedFiles, currentBranch),
  });

  if (isCancel(message)) {
    cancel('Commit cancelled');
    return {
      success: false,
      message: 'Commit cancelled'
    };
  }

  await createCommit(message);
  outro(`Commit created with message: ${message}`);
  return {
    success: true,
    message: `Commit created with message: ${message}`
  };
};

export default commit;