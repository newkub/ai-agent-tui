import { exec } from 'child_process';
import { promisify } from 'util';
import { color } from './color';
import type {
  Command,
  CommandActionFunction,
  CommandStep,
  CreatePromptFunction,
  Instruction
} from '../types/command';

const execAsync = promisify(exec);

class CLI {
  private commands: Map<string, Command> = new Map();

  command(name: string, description?: string): CommandBuilder {
    return new CommandBuilder(this, name, description);
  }

  async run(args?: string[]): Promise<void> {
    const commandName = args?.[0];
    if (!commandName) {
      this.showHelp();
      return;
    }

    const command = this.commands.get(commandName);
    if (!command) {
      console.error(color.red(`Unknown command: ${commandName}`));
      this.showHelp();
      return;
    }

    try {
      await command.action(args?.slice(1), {});
    } catch (error) {
      if (error instanceof Error) {
        console.error(color.red(`Error executing command: ${error.message}`));
      } else {
        console.error(color.red('An unknown error occurred'));
      }
    }
  }

  registerCommand(command: Command): void {
    this.commands.set(command.name, command);
  }

  private showHelp(): void {
    console.log(color.bold('Available commands:'));
    for (const [name, command] of this.commands.entries()) {
      console.log(`  ${color.green(name)}${command.description ? ` - ${command.description}` : ''}`);
    }
  }
}

class CommandBuilder {
  private command: Command;

  constructor(private cli: CLI, name: string, description?: string) {
    this.command = {
      name,
      description,
      action: async () => {}
    };
  }

  action(fn: CommandActionFunction): CommandBuilder {
    this.command.action = fn;
    return this;
  }

  register(): void {
    this.cli.registerCommand(this.command);
  }
}

const createPrompt: CreatePromptFunction = (steps: CommandStep[]): Instruction => {
  return {
    steps,
    execute: async () => {
      const results: string[] = [];
      
      for (const step of steps) {
        try {
          const { stdout } = await execAsync(`${step.command} ${step.args?.join(' ') || ''}`);
          results.push(stdout.trim());
          
          if (step.validate) {
            const validation = step.validate(stdout);
            if (typeof validation === 'string') {
              throw new Error(validation);
            }if (!validation) {
              throw new Error('Command validation failed');
            }
          }
        } catch (error) {
          throw new Error(`Failed to execute command: ${error.message}`);
        }
      }
      
      return results;
    }
  };
};

export {
  CLI,
  CommandBuilder,
  createPrompt
};
