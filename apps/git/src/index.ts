import pc from 'picocolors';
import { select, isCancel, outro } from '@clack/prompts';
import { commit, log, release, branch } from './commands';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import type { GitAssistanceConfig } from './types/defineConfig';
import { getGitStatus } from './status';

const execPromise = promisify(execCallback);

interface CommandHandler {
  value: string;
  label: string;
  handler: (config?: GitAssistanceConfig) => Promise<unknown>;
}

/**
 * Executes a shell command and returns the output
 */
export const runCommand = async (command: string): Promise<string> => {
  try {
    const { stdout } = await execPromise(command);
    return stdout.trim();
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    return '';
  }
};

/**
 * Truncates text to specified maximum length
 */
const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
};

/**
 * Main application entry point
 */
async function main(): Promise<void> {
  try {
    console.log(`\n${pc.magenta('🚀')} ${pc.bold(pc.cyan('Git Assistance'))} ${pc.magenta('✨')}`);
    console.log(`${pc.dim(pc.italic('Ready to enhance your Git workflow with AI assistance'))}`);
    
    const gitStatus = await getGitStatus();
    const maxLength = process.stdout.columns - 20;

    const commandHandlers: CommandHandler[] = [
      { 
        value: 'commit', 
        label: `✨ Commit        ${pc.dim(truncateText(gitStatus.commit, maxLength))}`,
        handler: commit
      },
      { 
        value: 'log', 
        label: `📝 Log           ${pc.dim(truncateText(gitStatus.commit, maxLength))}`,
        handler: log
      },
      { 
        value: 'release', 
        label: `🚀 Release       ${pc.dim(truncateText(gitStatus.tag, maxLength))}`,
        handler: release
      },
      { 
        value: 'branch', 
        label: `🌿 Branch        ${pc.dim(truncateText(gitStatus.branch, maxLength))}`,
        handler: branch
      }
    ];
    
    const selectedCommand = await select({
      message: 'Select a command',
      options: commandHandlers.map(({ value, label }) => ({ value, label }))
    });

    if (isCancel(selectedCommand)) {
      outro('Operation cancelled');
      process.exit(0);
    }

    const command = commandHandlers.find(cmd => cmd.value === selectedCommand);
    if (!command) {
      throw new Error('Invalid command selection');
    }

    await command.handler({} as GitAssistanceConfig);
  } catch (error) {
    console.error(pc.red('Failed to initialize:'), error);
    process.exit(1);
  }
}

main();
