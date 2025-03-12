export interface CommandStep {
  command: string;
  args?: string[];
  validate?: (output: string) => boolean | string;
}

export interface Instruction {
  steps: CommandStep[];
  description: string;
  validate?: (output: string) => boolean | string;
}