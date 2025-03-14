import pc from 'picocolors';
import { select, isCancel, outro } from '@clack/prompts';
import { commit, log, release, branch } from './commands';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import type { GitAssistanceConfig } from './types/defineConfig';

const execPromise = promisify(execCallback);

interface CommandHandler {
  value: string;
  label: string;
  handler: (config?: GitAssistanceConfig) => Promise<unknown>;
  hint?: string;
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
 * Main application entry point
 */
async function main(): Promise<void> {
  try {
    console.log(`\n${pc.magenta('🚀')} ${pc.bold(pc.cyan('Git Assistance'))} ${pc.magenta('✨')}`);
    console.log(`${pc.dim(pc.italic('Ready to enhance your Git workflow with AI assistance'))}`);

    const commandHandlers: CommandHandler[] = [
      { 
        value: 'commit', 
        label: "✨ Commit",
        handler: commit,
        hint: "Create a new commit with AI assistance"
      },
      { 
        value: 'log', 
        label: "📝 Log",
        handler: log,
        hint: "Browse and search through commit history"
      },
      { 
        value: 'release', 
        label: "🚀 Release",
        handler: release,
        hint: "Create a new release with version management"
      },
      { 
        value: 'branch', 
        label: "🌿 Branch",
        handler: branch,
        hint: "Manage Git branches"
      }
    ];
    
    const selectedCommand = await select({
      message: 'Select a command',
      options: commandHandlers.map(({ value, label, hint }) => ({ value, label, hint }))
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
