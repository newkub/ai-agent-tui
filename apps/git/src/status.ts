import pc from 'picocolors';
import { runCommand } from './index';

export interface GitStatus {
  commit: string;
  branch: string;
  tag: string;
}

export async function getGitStatus(): Promise<GitStatus> {
  try {
    const [commit, branch, tag] = await Promise.all([
      runCommand('git log -1 --pretty=format:"%s (%ad)" --date=short'),
      runCommand('git branch --show-current'),
      runCommand('git describe --tags --abbrev=0 2>/dev/null').catch(() => 'No tags')
    ]);

    return { 
      commit: commit || 'No commits', 
      branch: branch || 'No branch', 
      tag: tag || 'No tags' 
    };
  } catch (error) {
    console.error(pc.red('Error getting git status:'), error);
    return { commit: 'No commits', branch: 'No branch', tag: 'No tags' };
  }
}
