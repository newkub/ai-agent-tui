import type { GitAssistanceConfig } from '../types/defineConfig';
import config from '../../git-assistance.config';
import { defaultConfig } from '../types/defineConfig';

let localConfig = config || defaultConfig;

export function setConfig(newConfig: GitAssistanceConfig) {
  localConfig = newConfig;
}

export async function useModel(prompt: string): Promise<string> {
  if (!localConfig?.ai) {
    localConfig = defaultConfig;
  }
  const modelType = localConfig.ai.useModel;
  switch (modelType) {
    case 'claude-3.7-sonnet': {
      const response = await import('./anthropic').then(module => module.anthropicClient(prompt));
      return response;
    }
    case 'deepseek': {
      const response = await import('./deepseek').then(module => module.deepseekClient(prompt));
      if (!response) throw new Error('No response from Deepseek');
      return response;
    }
    case 'gpt-4o': {
      const response = await import('./openai').then(module => module.openaiClient(prompt, { model: modelType }));
      return response.content;
    }
    default: {
      throw new Error(`Unsupported model type: ${modelType}`);
    }
  }
}

export { anthropicClient } from './anthropic';
export { deepseekClient } from './deepseek';
export { openaiClient } from './openai';
