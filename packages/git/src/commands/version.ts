import { execa } from 'execa';
import semver from 'semver';

export const getLatestTag = async (): Promise<string | null> => {
  try {
    const { stdout } = await execa('git', ['describe', '--tags', '--abbrev=0']);
    return stdout.trim();
  } catch {
    return null;
  }
};

export const bumpVersion = (currentVersion: string, type: semver.ReleaseType): string => {
  return semver.inc(currentVersion, type) || currentVersion;
};

export const generateChangelog = async (_newVersion: string): Promise<void> => {
  await execa('npx', ['conventional-changelog', '-p', 'angular', '-i', 'CHANGELOG.md', '-s', '-r', '0']);
};
