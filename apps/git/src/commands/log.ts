import { intro, outro, select, isCancel, text } from '@clack/prompts';
import { execa } from 'execa';
import pc from 'picocolors';
import nodeFzf from 'node-fzf';

interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

const getLogHistory = async (): Promise<Commit[]> => {
  const { stdout } = await execa('git', [
    'log',
    '--pretty=format:%H%x00%an%x00%ad%x00%s',
    '--date=short'
  ]);

  if (!stdout) return [];

  return stdout.split('\n').map(line => {
    const [hash, author, date, message] = line.split('\0');
    return { hash, author, date, message };
  });
};

const logHandler = async () => {
  intro('Git Log');

  try {
    const logs = await getLogHistory();
    
    if (!logs.length) {
      outro('No commit history found');
      return { success: true, message: 'No commits found' };
    }

    const formattedLogs = logs.map(log => 
      `${pc.yellow(log.hash.slice(0, 7))} ${pc.green(log.date)} ${pc.blue(log.author)}: ${log.message}`
    );

    const result = await nodeFzf(formattedLogs);
    
    if (result.selected) {
      const selectedCommit = logs[result.selected.index];
      console.log('\nCommit Details:');
      console.log(`Hash: ${pc.yellow(selectedCommit.hash)}`);
      console.log(`Author: ${pc.blue(selectedCommit.author)}`);
      console.log(`Date: ${pc.green(selectedCommit.date)}`);
      console.log(`Message: ${selectedCommit.message}`);
      
      const action = await select({
        message: 'What would you like to do with this commit?',
        options: [
          { value: 'checkout', label: 'Checkout this commit', hint: 'Switch to this commit state' },
          { value: 'createBranch', label: 'Create a branch from this commit', hint: 'Make a new branch at this point' },
          { value: 'showDiff', label: 'Show diff for this commit', hint: 'View code changes' },
          { value: 'cancel', label: 'Cancel', hint: 'Return to main menu' }
        ]
      });
      
      if (isCancel(action) || action === 'cancel') {
        outro('Operation cancelled');
        return { success: true, message: 'Operation cancelled' };
      }
      
      switch (action) {
        case 'checkout':
          await execa('git', ['checkout', selectedCommit.hash]);
          outro(`Checked out commit ${pc.yellow(selectedCommit.hash.slice(0, 7))}`);
          break;
        case 'createBranch': {
          const branchName = await text({ 
            message: 'Enter new branch name:',
          });
          if (isCancel(branchName)) {
            outro('Branch creation cancelled');
            break;
          }
          await execa('git', ['checkout', '-b', branchName, selectedCommit.hash]);
          outro(`Created branch ${pc.green(branchName)} from commit ${pc.yellow(selectedCommit.hash.slice(0, 7))}`);
          break;
        }
        case 'showDiff': {
          const { stdout } = await execa('git', ['show', selectedCommit.hash]);
          console.log(stdout);
          outro(`Showed diff for commit ${pc.yellow(selectedCommit.hash.slice(0, 7))}`);
          break;
        }
      }
    }

    return { success: true, message: 'Log displayed successfully' };
  } catch (error) {
    outro(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export default logHandler;
