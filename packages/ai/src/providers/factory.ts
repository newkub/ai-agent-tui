import { OpenAI } from './openai';
import { Anthropic } from './anthropic';
import { Deepseek } from './deepseek';
import type { ProviderParams } from '../types/provider-params';

export function getProvider(provider: ProviderParams) {
  switch (provider) {
    case 'openai':
      return new OpenAI();
    case 'anthropic':
      return new Anthropic();
    case 'deepseek':
      return new Deepseek();
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
