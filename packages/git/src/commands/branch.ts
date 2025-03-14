import { execa } from 'execa';
import type { GitCommandOptions } from '../types/git';

export const getAllBranches = async (options?: GitCommandOptions): Promise<string[]> => {
  const { stdout } = await execa('git', ['branch', '--format=%(refname:short)'], {
    cwd: options?.cwd
  });
  return stdout.split('\n').filter(Boolean);
};

export const getLocalBranches = async (options?: GitCommandOptions): Promise<string[]> => {
  const { stdout } = await execa('git', ['branch', '--format=%(refname:short)'], {
    cwd: options?.cwd
  });
  return stdout.split('\n').filter(Boolean);
};

export const getCurrentBranch = async (options?: GitCommandOptions): Promise<string> => {
  const { stdout } = await execa('git', ['branch', '--show-current'], {
    cwd: options?.cwd
  });
  return stdout.trim();
};

export const checkoutBranch = async (branchName: string, options?: GitCommandOptions): Promise<void> => {
  await execa('git', ['checkout', branchName], {
    cwd: options?.cwd
  });
};

export const mergeBranch = async (branchName: string, options?: GitCommandOptions): Promise<void> => {
  await execa('git', ['merge', branchName], {
    cwd: options?.cwd
  });
};

export const deleteBranch = async (branchName: string, options?: GitCommandOptions): Promise<void> => {
  await execa('git', ['branch', '-d', branchName], {
    cwd: options?.cwd
  });
};

export const branchFromCommit = async (commitHash: string, branchName: string, options?: GitCommandOptions): Promise<void> => {
  await execa('git', ['checkout', '-b', branchName, commitHash], {
    cwd: options?.cwd
  });
};
