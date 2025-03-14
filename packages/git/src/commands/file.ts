import type { ExecuteResult, GitCommandOptions, GitCommandName, GitStatusFile } from '../types/git';
import { execute } from './execute';
import { execSync } from 'child_process';

export const add = async (files: string[], options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute(`git add ${files.join(' ')}`, options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'add' as const
      }
    };
  }
};

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

export function getFileChanges(): string[] {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());
  } catch (error) {
    console.error('Error checking git status:', error);
    return [];
  }
}

export const getStagedFiles = async (options: GitCommandOptions = {}): Promise<string[]> => {
  try {
    const stagedFiles = await execute('git diff --cached --name-only', options);
    return stagedFiles ? stagedFiles.split('\n').filter(Boolean) : [];
  } catch (error) {
    console.error('Error getting staged files:', error);
    return [];
  }
};

export const getFileStatus = async (filePath: string, options: GitCommandOptions = {}): Promise<ExecuteResult<GitStatusFile>> => {
  try {
    const status = (await execute(`git status --porcelain ${filePath}`, options)).trim();
    if (!status) {
      return { 
        success: false, 
        error: {
          code: 404,
          message: 'File not found in git tracking',
          command: 'status' as const
        }
      };
    }

    const [code] = status.split(' ');
    const fileStatus = 
      code.includes('A') ? 'added' :
      code.includes('M') ? 'modified' :
      code.includes('D') ? 'deleted' :
      code.includes('R') ? 'renamed' :
      code.includes('C') ? 'copied' :
      code.includes('??') ? 'untracked' : 'modified';

    return { 
      success: true, 
      data: { 
        path: filePath,
        status: fileStatus,
        oldPath: code.includes('R') ? status.split(' -> ')[0].slice(3) : undefined
      }
    };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'status' as const
      }
    };
  }
};
