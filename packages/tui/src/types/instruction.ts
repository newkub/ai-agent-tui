export type CommandStep = {
  command: string;
  args: string[];
};

export type Instruction = {
  steps: CommandStep[];
  description: string;
  validate?: (output: string) => boolean | string;
};

export type CreatePromptFunction = (steps: CommandStep[]) => Instruction;
