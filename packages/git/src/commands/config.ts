import type { ExecuteResult, GitCommandOptions, GitAuthor, GitCommandName } from '../types/git';
import { execute } from './execute';

const getConfig = async (key: string, options: GitCommandOptions = {}): Promise<ExecuteResult<string>> => {
  try {
    const value = await execute(`git config --get ${key}`, options);
    return { success: true, data: value };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'config' as GitCommandName
      }
    };
  }
};

const setConfig = (key: string, value: string, options: GitCommandOptions = {}): ExecuteResult<boolean> => {
  try {
    execute(`git config ${key} "${value}"`, options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'config' as GitCommandName
      }
    };
  }
};

const getAuthor = async (options: GitCommandOptions = {}): Promise<ExecuteResult<GitAuthor>> => {
  try {
    const [nameResult, emailResult] = await Promise.all([
      getConfig('user.name', options),
      getConfig('user.email', options)
    ]);

    if (!nameResult.success || !nameResult.data) {
      return {
        success: false,
        error: {
          code: 404,
          message: 'Git user.name not configured',
          command: 'config' as GitCommandName
        }
      };
    }

    if (!emailResult.success || !emailResult.data) {
      return {
        success: false,
        error: {
          code: 404,
          message: 'Git user.email not configured',
          command: 'config' as GitCommandName
        }
      };
    }

    return { 
      success: true, 
      data: { 
        name: nameResult.data,
        email: emailResult.data
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'config' as GitCommandName
      }
    };
  }
};

export { getConfig, setConfig, getAuthor };
