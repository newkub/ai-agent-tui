import { execute } from './execute';
import type { GitCommandOptions, GitBranch } from './types/git';

export const getCurrentBranch = async (options: GitCommandOptions = {}): Promise<GitBranch> => {
  try {
    return await execute('git branch --show-current', options);
  } catch (error) {
    console.error('Error getting current branch:', error);
    return '';
  }
};
