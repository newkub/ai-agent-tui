import { AIError } from '../types/providers';

export const handleProviderError = (error: unknown, context: string, providerName: string): never => {
  console.error(`[${providerName}] Error in ${context}:`, error);
  throw new AIError(`[${providerName}] Error in ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`);
};
