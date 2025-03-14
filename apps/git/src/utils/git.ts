export interface CommitMessageConfig {
  emoji: { enabled: boolean };
  bulletPoints: { enabled: boolean; maxItems: number };
  translate: { enabled: boolean };
}

export interface CommitAnswers {
  type: string;
  scope: string;
  description: string;
  emoji: string;
  bulletPoints: string[];
}

export interface GitStatusResult {
  staged: number;
  unstaged: number;
  untracked: number;
  files: string[];
}

import { execa } from 'execa';
import pc from 'picocolors';

export function generateCommitMessage(config: CommitMessageConfig, answers: CommitAnswers): string {
  const { type, scope, description, emoji } = answers;
  
  let message = `${type}${scope ? `(${scope})` : ''}: ${description}`;

  if (config.emoji.enabled && emoji) {
    message += ` ${emoji}`;
  }

  if (config.translate.enabled) {
    message = translateMessage(message, config.translate);
  }

  return message;
}

export function translateMessage(message: string, _translateConfig: { enabled: boolean }): string {
  return message;
}

export async function getGitStatus(): Promise<GitStatusResult> {
  const { stdout: statusOutput } = await execa('git', ['status', '--porcelain']);
  const statusFiles = statusOutput.split('\n').filter(Boolean);
  return {
    staged: statusFiles.filter(file => !file.startsWith(' ')).length,
    unstaged: statusFiles.filter(file => file.startsWith(' ')).length,
    untracked: statusFiles.filter(file => file.startsWith('??')).length,
    files: statusFiles
  };
}

export function displayStatusSummary(status: GitStatusResult) {
  console.log(pc.cyan('Git Status Summary:'));
  console.log(`  ${pc.green(`${status.staged} staged changes`)}`);
  console.log(`  ${pc.yellow(`${status.unstaged} unstaged changes`)}`);
  console.log();
}

export function displayDetailedChanges(statusFiles: string[]) {
  console.log(pc.cyan('Detailed Changes:'));
  const statusMap: Record<string, string> = {
    'M': pc.green('modified'),
    'A': pc.green('added'),
    'D': pc.red('deleted'),
    'R': pc.yellow('renamed'),
    'C': pc.blue('copied'),
    'U': pc.magenta('updated but unmerged'),
    '??': pc.cyan('untracked')
  };

  for (const file of statusFiles) {
    const status = file.slice(0, 2).trim();
    const path = file.slice(3);
    console.log(`  ${statusMap[status] || pc.gray('unknown')}: ${path}`);
  }
  console.log();
}

export * from './git';
