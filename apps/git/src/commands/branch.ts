import { intro, outro, select, isCancel } from '@clack/prompts';
import { execa } from 'execa';
import pc from 'picocolors';
import nodeFzf from 'node-fzf';

interface Branch {
  name: string;
  current: boolean;
}

const getBranches = async (): Promise<Branch[]> => {
  const { stdout } = await execa('git', ['branch', '--list', '--format=%(refname:short)%00%(HEAD)']);
  return stdout.split('\n')
    .filter(Boolean)
    .map(line => {
      const [name, isCurrent] = line.split('\0');
      return {
        name,
        current: isCurrent === '*'
      };
    });
};

const checkoutBranch = async (branch: string): Promise<void> => {
  await execa('git', ['checkout', branch]);
};

const handler = async () => {
  intro('Git Branch');

  try {
    const branches = await getBranches();
    
    if (!branches.length) {
      outro('No branches found');
      return;
    }

    const formattedBranches = branches.map(branch => 
      `${branch.current ? pc.green('* ') : '  '}${branch.name} ${branch.current ? pc.blue('(current)') : ''}`
    );

    const result = await nodeFzf(formattedBranches);
    
    if (result.selected) {
      const selectedBranch = branches[result.selected.index];
      
      if (!selectedBranch.current) {
        const action = await select({
          message: `Selected branch: ${pc.green(selectedBranch.name)}. What would you like to do?`,
          options: [
            { value: 'checkout', label: 'Checkout branch' },
            { value: 'merge', label: 'Merge into current branch' },
            { value: 'delete', label: 'Delete branch' },
            { value: 'cancel', label: 'Cancel' }
          ]
        });

        if (isCancel(action)) {
          outro('Operation canceled');
          return;
        }

        switch (action) {
          case 'checkout':
            console.log(`\nSwitching to branch: ${pc.green(selectedBranch.name)}`);
            await checkoutBranch(selectedBranch.name);
            outro(`Successfully switched to ${pc.green(selectedBranch.name)}`);
            break;
          case 'merge':
            console.log(`\nMerging ${pc.green(selectedBranch.name)} into current branch`);
            await execa('git', ['merge', selectedBranch.name]);
            outro(`Successfully merged ${pc.green(selectedBranch.name)}`);
            break;
          case 'delete':
            console.log(`\nDeleting branch: ${pc.green(selectedBranch.name)}`);
            await execa('git', ['branch', '-d', selectedBranch.name]);
            outro(`Successfully deleted ${pc.green(selectedBranch.name)}`);
            break;
          case 'cancel':
            outro('Operation canceled');
            break;
        }
      } else {
        outro(`Already on branch ${pc.green(selectedBranch.name)}`);
      }
    }
  } catch (error) {
    outro(`Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default handler;
