import type { CommandStep, Instruction } from '../types/instruction';
import { color } from './color';

function createPrompt(description: string, steps: CommandStep[]): Instruction {
  return {
    description: color.cyan(description),
    steps,
    validate: () => true
  };
}

export { createPrompt };
