import { execSync } from 'child_process';

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export const getCurrentBranch = (): string => {
  return execSync('git branch --show-current').toString().trim();
};

export const getCommitHistory = (limit = 10): string[] => {
  const history = execSync(`git log -n ${limit} --pretty=format:'%h - %s'`).toString().trim();
  return history.split('\n');
};

export const getCommits = (limit = 10): Commit[] => {
  const history = execSync(`git log -n ${limit} --pretty=format:'%h|%s|%an|%ad'`).toString().trim();
  return history.split('\n').map(line => {
    const [hash, message, author, date] = line.split('|');
    return { hash, message, author, date };
  });
};

export const getLatestTag = (): string => {
  return execSync('git describe --tags --abbrev=0').toString().trim();
};

export const getStagedFiles = (): string[] => {
  const stagedFiles = execSync('git diff --cached --name-only').toString().trim();
  return stagedFiles.split('\n').filter(Boolean);
};

export const createCommit = (message: string): void => {
  execSync(`git commit -m '${message}'`);
};

export const createRelease = (tag: string, message: string): void => {
  execSync(`git tag -a ${tag} -m '${message}'`);
};
