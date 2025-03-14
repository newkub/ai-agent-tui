import type { ExecuteResult, GitCommandOptions, GitStatusFile } from '../types/git';
import { execute } from './execute';

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
