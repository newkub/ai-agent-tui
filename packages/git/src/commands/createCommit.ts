import type { GitCommandOptions, GitMessage, ExecuteResult, GitCommandName } from '../types/git';
import { execute } from './execute';

export const createCommit = async (message: GitMessage, options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute(`git commit -m "${message.replace(/"/g, '"')}"`, options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'commit' as GitCommandName
      }
    };
  }
};
