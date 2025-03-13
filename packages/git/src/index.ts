import { spawn } from 'child_process';
import type { 
  GitBranch,
  GitMessage,
  GitTag,
  GitCommandOptions,
  GitStatus,
  ExecuteResult,
  GitCommandName,
  GitStatusFile,
  GitLogFormat,
  GitDateISO,
  GitAuthor,
  ChangelogOptions,
  ChangelogEntry
} from './types';

export type Commit = {
  hash: string;
  author: {
    name: string;
    email: string;
  };
  date: string;
  message: string;
  branch?: string;
  tags?: string[];
};

const DEFAULT_LOG_FORMAT = 'medium' as GitLogFormat;

const execute = (command: string, { workingDir }: GitCommandOptions = {}): Promise<string> => {
  // Normalize command for Windows
  const normalizedCommand = command.replace(/\//g, '\\').replace(/'/g, '"');
  return new Promise((resolve, reject) => {
    // Use execSync for better Windows compatibility
const [cmd, ...args] = process.platform === 'win32' ? ['cmd', '/c', normalizedCommand] : normalizedCommand.split(' ');
    const options = workingDir ? { cwd: workingDir, shell: true } : { shell: true };
    const child = spawn(cmd, args, options);
    
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
};

const getCurrentBranch = async (options: GitCommandOptions = {}): Promise<GitBranch> => {
  try {
    return await execute('git branch --show-current', options);
  } catch (error) {
    console.error('Error getting current branch:', error);
    return '';
  }
};

const getCommitHistory = async (limit = 10, options: GitCommandOptions = {}): Promise<string[]> => {
  try {
    const history = await execute(`git log -n ${limit} --pretty=format:'%h - %s'`, options);
    if (!history) return [];
    const lines = history.split('\n');
    return lines.map(line => line || '');
  } catch (error) {
    console.error('Error getting commit history:', error);
    return [];
  }
};

const getCommits = async (limit = 10, options: GitCommandOptions = {}): Promise<Commit[]> => {
  try {
    const history = await execute(`git log -n ${limit} --pretty=format:'%h|%s|%an <%ae>|%ad'`, options);
    if (!history) return [];
    
    return history.split('\n').map(line => {
      const [hash, message, authorStr, date] = line.split('|');
      const [name, email] = (authorStr || '').split(' <').map(s => s.replace('>', ''));
      return { 
        hash, 
        message, 
        author: { name: name || 'Unknown', email: email || '' },
        date 
      };
    });
  } catch (error) {
    console.error('Error getting commits:', error);
    return [];
  }
};

const getLatestTag = async (options: GitCommandOptions = {}): Promise<ExecuteResult<GitTag>> => {
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

const getStagedFiles = async (options: GitCommandOptions = {}): Promise<string[]> => {
  try {
    const stagedFiles = await execute('git diff --cached --name-only', options);
    return stagedFiles ? stagedFiles.split('\n').filter(Boolean) : [];
  } catch (error) {
    console.error('Error getting staged files:', error);
    return [];
  }
};

const createCommit = async (message: GitMessage, options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
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

const createRelease = async (tag: GitTag, message: GitMessage, options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute(`git tag -a ${tag} -m "${message.replace(/"/g, '"')}"`, options);
    return { success: true, data: true };
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

const push = async (options: GitCommandOptions = { remote: 'origin' }): Promise<ExecuteResult<boolean>> => {
  try {
    const branchName = options.branch || await getCurrentBranch(options);
    await execute(`git push ${options.remote} ${branchName}`, options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'push' as GitCommandName
      }
    };
  }
};

const status = async (options: GitCommandOptions = {}): Promise<GitStatus> => {
  const stagedPaths = await getStagedFiles(options);
  const modifiedPaths = (await execute('git diff --name-only', options)).split('\n').filter(Boolean);
  const untrackedPaths = (await execute('git ls-files --others --exclude-standard', options)).split('\n').filter(Boolean);
  
  const staged = stagedPaths.map((path: string): GitStatusFile => ({ path, status: 'added' }));
  const modified = modifiedPaths.map((path: string): GitStatusFile => ({ path, status: 'modified' }));
  const untracked = untrackedPaths.map((path: string): GitStatusFile => ({ path, status: 'untracked' }));
  
  const branch = await getCurrentBranch(options);
  
  // Get ahead/behind counts
  const revCount = await execute('git rev-list --left-right --count HEAD...@{upstream}', options);
  const [ahead, behind] = revCount.split('\t').map(Number);
  
  return { staged, modified, untracked, branch, ahead, behind };
};

const getLogHistory = async (options: GitCommandOptions = {}): Promise<Commit[]> => {
  const format = options.logFormat || DEFAULT_LOG_FORMAT;
  const formatStr = format === 'oneline' ? '%h|%s' :
    format === 'short' ? '%h|%s|%an' :
    format === 'medium' ? '%h|%s|%an|%ad|%D' :
    format === 'full' ? '%h|%s|%an|%ad|%D|%P' :
    '%h|%s|%an|%ad';

  const history = await execute(`git log --pretty=format:'${formatStr}'`, options);
  if (!history) return [];

  return history.split('\n').map((line: string) => {
    const [hash, message, authorStr, date, refs, parentHashes] = line.split('|');
    const tags = refs?.match(/tag: ([^,)]+)/g)?.map((tag: string) => tag.replace('tag: ', '')) || [];
    const branch = refs?.match(/HEAD -> ([^,)]+)/)?.[1] || undefined;
    const [name, email] = (authorStr || '').split(' <').map(s => s.replace('>', ''));

    return { 
      hash, 
      message, 
      author: { name: name || 'Unknown', email: email || '' },
      date: date as GitDateISO,
      parentHashes: parentHashes?.split(' ') || [],
      branch,
      tags
    };
  });
};

const getFileStatus = async (filePath: string, options: GitCommandOptions = {}): Promise<ExecuteResult<GitStatusFile>> => {
  try {
    const status = (await execute(`git status --porcelain ${filePath}`, options)).trim();
    if (!status) {
      return { 
        success: false, 
        error: {
          code: 404,
          message: 'File not found in git tracking',
          command: 'status' as GitCommandName
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
        command: 'status' as GitCommandName
      }
    };
  }
};

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

const generateChangelog = async (options: ChangelogOptions): Promise<ChangelogEntry[]> => {
  const { includeTypes } = options;
  const commits = await getCommits();

  return commits
    .filter(commit => includeTypes.some((type: string) => commit.message.startsWith(type)))
    .map(commit => ({
      type: commit.message.split(':')[0],
      message: commit.message,
      hash: commit.hash,
      date: commit.date
    }));
};

// Export all functions
const init = async (options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute('git init', options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'init' as GitCommandName
      }
    };
  }
};

const add = async (files: string[], options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
  try {
    await execute(`git add ${files.join(' ')}`, options);
    return { success: true, data: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: {
        code: (error as { status?: number })?.status ?? -1,
        message: (error as { message?: string })?.message ?? 'Unknown error',
        command: 'add' as GitCommandName
      }
    };
  }
};

const rm = async (files: string[], options: GitCommandOptions = {}): Promise<ExecuteResult<boolean>> => {
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

export {
  init,
  add,
  rm,
  getCurrentBranch,
  getCommits,
  getCommitHistory,
  getLatestTag,
  getStagedFiles,
  createCommit,
  createRelease,
  push,
  status,
  generateChangelog,
  getLogHistory,
  getAuthor,
  getConfig,
  getFileStatus,
  setConfig
};
