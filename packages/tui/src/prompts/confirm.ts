import { Prompt } from '../types/prompt';

export interface ConfirmPrompt extends Prompt {
  type: 'confirm';
  message: string;
  default?: boolean;
}

export function createConfirmPrompt(message: string, defaultValue?: boolean): ConfirmPrompt {
  return {
    type: 'confirm',
    message,
    default: defaultValue,
  };
}
