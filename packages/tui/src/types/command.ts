type CommandStep = {
  command: string;
  args?: string[];
  validate?: (output: string) => boolean | string;
};

interface CommandOptions {
  cwd?: string;
  timeout?: number;
  silent?: boolean;
}

interface Command {
  name: string;
  description?: string;
  action: (args: string[], options: CommandOptions) => Promise<void>;
}

type CommandActionFunction = (args: string[], options: CommandOptions) => Promise<void>;

interface CLI {
  registerCommand(command: Command): void;
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

  action(fn: (args: string[], options: CommandOptions) => Promise<void>): CommandBuilder {
    this.command.action = fn;
    return this;
  }

  register(): void {
    this.cli.registerCommand(this.command);
  }
}

export {
  type CommandStep,
  type CommandOptions,
  type Command,
  type CommandActionFunction,
  type CLI,
  CommandBuilder
};

export type Instruction = {
  steps: CommandStep[];
  execute: () => Promise<string[]>;
};

export type CreatePromptFunction = (steps: CommandStep[]) => Instruction;
