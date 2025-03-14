import { execute } from './execute';
import type { GitCommandOptions, GitTag, ExecuteResult, GitCommandName } from './types/git';

export const getLatestTag = async (options: GitCommandOptions = {}): Promise<ExecuteResult<GitTag>> => {
  try {
    const tag = await execute('git describe --tags --abbrev=0', options);
    return { success: true, data: tag };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'tag' as GitCommandName
      }
    };
  }
};
