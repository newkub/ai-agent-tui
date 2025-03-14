import type { GitAssistanceConfig } from '../types/defineConfig';
import config from '../../git-assistance.config';
import { defaultConfig } from '../types/defineConfig';
import { anthropicClient } from './anthropic';
import { deepseekClient } from './deepseek';
import { openaiClient } from './openai';

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
      const response = await anthropicClient(prompt);
      return response;
    }
    case 'deepseek': {
      const response = await deepseekClient(prompt);
      if (!response) throw new Error('No response from Deepseek');
      return response;
    }
    case 'gpt-4o': {
      const response = await openaiClient(prompt, { model: modelType });
      return response.content;
    }
    default: {
      throw new Error(`Unsupported model type: ${modelType}`);
    }
  }
}
