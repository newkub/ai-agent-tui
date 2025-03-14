import { intro, outro } from '@clack/prompts';
import nodeFzf from 'node-fzf';
import { execa } from 'execa';
import pc from 'picocolors';

interface Branch {
  name: string;
  current: boolean;
}

const getBranches = async (): Promise<Branch[]> => {
  const { stdout } = await execa('git', ['branch', '--list', '--format=%(refname:short)%00%(HEAD)']);
  return stdout.split('\n').map(line => {
    const [name, isCurrent] = line.split('\0');
    return {
      name,
      current: isCurrent === '*'
    };
  });
};

const checkoutBranch = async (_branch: string): Promise<void> => {
  await execa('git', ['checkout', _branch]);
};

const handler = async () => {
  intro('Git Branch');

  try {
    const branches = await getBranches();
    
    if (!branches.length) {
      outro('No branches found');
      return;
    }

    const formattedBranches = branches.map((branch: Branch) => 
      `${branch.current ? pc.green('* ') : '  '}${branch.name} ${branch.current ? pc.blue('(current)') : ''}`
    );

    const result = await nodeFzf(formattedBranches);
    
    if (result.selected) {
      const selectedBranch = branches[result.selected.index];
      
      if (!selectedBranch.current) {
        console.log(`\nSwitching to branch: ${pc.green(selectedBranch.name)}`);
        await checkoutBranch(selectedBranch.name);
        outro(`Successfully switched to ${pc.green(selectedBranch.name)}`);
      } else {
        outro(`Already on branch ${pc.green(selectedBranch.name)}`);
      }
    }
  } catch (error) {
    outro(`Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default handler;
