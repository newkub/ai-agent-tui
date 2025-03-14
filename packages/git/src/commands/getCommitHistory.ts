import { execute } from './execute';
import type { GitCommandOptions, GitDateISO, GitLogFormat, Commit } from '../types/git';

const DEFAULT_LOG_FORMAT = 'medium' as GitLogFormat;

export const getCommitHistory = async (limit = 10, options: GitCommandOptions = {}): Promise<string[]> => {
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

export const getLogHistory = async (options: GitCommandOptions = {}): Promise<Commit[]> => {
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
