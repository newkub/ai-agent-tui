import type { ExecuteResult, GitCommandOptions } from '../types/git';
export { execute } from './execute';

export const init = async (options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute('git init', options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'init' as const
      }
    };
  }
};
