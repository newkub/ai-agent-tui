import { execSync } from 'child_process';

export function getFileChange(): string[] {
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
