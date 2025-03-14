import type { ChangelogEntry, ChangelogOptions } from '../types/git';
import { getCommits } from './getCommits';

export const generateChangelog = async (options: ChangelogOptions): Promise<ChangelogEntry[]> => {
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
