import type { ExecuteResult, GitCommandOptions, GitCommandName } from '../types/git';
import { execute } from './execute';

export const rm = async (files: string[], options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute(`git rm ${files.join(' ')}`, options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'rm' as GitCommandName
      }
    };
  }
};
