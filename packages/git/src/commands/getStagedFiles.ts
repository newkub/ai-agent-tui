import { execute } from './execute';
import type { GitCommandOptions } from './types/git';

export const getStagedFiles = async (options: GitCommandOptions = {}): Promise<string[]> => {
  try {
    const stagedFiles = await execute('git diff --cached --name-only', options);
    return stagedFiles ? stagedFiles.split('\n').filter(Boolean) : [];
  } catch (error) {
    console.error('Error getting staged files:', error);
    return [];
  }
};
