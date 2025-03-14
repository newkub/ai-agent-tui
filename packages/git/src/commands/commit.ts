import { execa } from 'execa';

interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

export const getLogHistory = async (): Promise<Commit[]> => {
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

export const checkoutCommit = async (hash: string): Promise<void> => {
  await execa('git', ['checkout', hash]);
};

export const createBranchFromCommit = async (hash: string, branchName: string): Promise<void> => {
  await execa('git', ['checkout', '-b', branchName, hash]);
};

export const showCommitDiff = async (hash: string): Promise<string> => {
  const { stdout } = await execa('git', ['show', hash]);
  return stdout;
};
