import type { Prompt, InputPrompt, MultiSelectPrompt } from './types/prompt';

export interface PromptOptions<T = string> {
  type: 'input' | 'multi-select';
  name: string;
  message: string;
  initial?: T;
  required?: boolean;
  choices?: Array<{ value: T; label: string }>;
}

export async function prompt<T = string>(options: Prompt<T>): Promise<T> {
  if (!options.type) {
    throw new Error('Prompt type is required');
  }

  switch (options.type) {
    case 'input':
      return (await import('./prompts/input')).default(options as InputPrompt<T>);
    case 'multi-select':
      return (await import('./prompts/multi-select')).default(options as MultiSelectPrompt<T>);
    default:
      throw new Error(`Unsupported prompt type: ${options.type}`);
  }
}

export function createPrompt<T = string>(options: PromptOptions<T>): Prompt<T> {
  if (options.type === 'multi-select' && !options.choices) {
    throw new Error('Choices are required for multi-select prompts');
  }

  return {
    ...options,
    required: options.required ?? true
  } as Prompt<T>;
}