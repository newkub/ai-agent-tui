import { AIError } from '../types/providers';

interface CompletionOptions {
  model: string;
  messages: unknown[];
}

export function validateCompletionOptions(options: CompletionOptions): boolean {
  if (!options.model) {
    throw new AIError('Model is required');
  }
  if (!options.messages || options.messages.length === 0) {
    throw new AIError('Messages are required');
  }
  return true;
}
