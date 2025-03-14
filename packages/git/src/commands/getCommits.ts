import { execute } from './execute';
import type { GitCommandOptions } from '../types/git';
import type { Commit } from '../types/git';

export const getCommits = async (limit = 10, options: GitCommandOptions = {}): Promise<Commit[]> => {
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
