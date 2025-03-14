import { text, log, isCancel, outro } from '@clack/prompts';
import pc from 'picocolors';
import { mergeBranch } from '@newkub/git';

async function mergeCommand() {
  try {
    const branch = await text({
      message: 'Enter branch to merge',
      placeholder: 'feature/branch-name',
    });

    if (isCancel(branch)) {
      outro('Operation canceled');
      return;
    }

    if (typeof branch !== 'string') {
      throw new Error('Invalid branch name');
    }

    console.log(`\nMerging ${pc.green(branch)} into current branch`);
    await mergeBranch(branch);
    log.success(`Merged ${pc.green(branch)} into current branch`);
  } catch (error) {
    log.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

export default mergeCommand;
