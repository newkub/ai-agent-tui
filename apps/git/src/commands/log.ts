import { intro, outro } from '@clack/prompts';
import nodeFzf from 'node-fzf';
import { execa } from 'execa';
import pc from 'picocolors';

interface Commit {
  hash: string;
  author: { name: string };
  date: string;
  message: string;
}

const getLogHistory = async (): Promise<Commit[]> => {
  const { stdout } = await execa('git', [
    'log',
    '--pretty=format:%H%x00%an%x00%ad%x00%s',
    '--date=short'
  ]);

  return stdout.split('\n').map(line => {
    const [hash, author, date, message] = line.split('\0');
    return {
      hash,
      author: { name: author },
      date,
      message
    };
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
      `${pc.yellow(log.hash.slice(0, 7))} ${pc.green(log.date)} ${pc.blue(log.author.name)}: ${log.message}`
    );

    const result = await nodeFzf(formattedLogs);
    
    if (result.selected) {
      const selectedCommit = logs[result.selected.index];
      console.log('\nCommit Details:');
      console.log(`Hash: ${pc.yellow(selectedCommit.hash)}`);
      console.log(`Author: ${pc.blue(selectedCommit.author.name)}`);
      console.log(`Date: ${pc.green(selectedCommit.date)}`);
      console.log(`Message: ${selectedCommit.message}`);
    }

    return { success: true, message: 'Log displayed successfully' };
  } catch (error) {
    outro(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export default logHandler;
