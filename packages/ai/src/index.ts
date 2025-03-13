// AI module index file

import type { ProviderParams } from './types/provider-params';
import type { Capabilities } from './types/capabilities';
import type { CapabilityParams } from './types/capability-params';
import { OpenAIProvider } from './providers/openai';
import { DeepseekProvider } from './providers/deepseek';
import { Anthropic } from './providers/anthropic';

interface AIProvider {
  textgen(prompt: string): Promise<string>;
  imagegen(prompt: string): Promise<string>;
}

function providers(provider: ProviderParams): Capabilities {
  const capabilities: Capabilities = {
    textgen: (prompt: CapabilityParams['prompt']) => {
      const selectedProvider = provider ? getProvider(provider) : getDefaultProvider();
      return selectedProvider.textgen(prompt);
    },
    imagegen: (prompt: CapabilityParams['prompt']) => {
      const selectedProvider = provider ? getProvider(provider) : getDefaultProvider();
      return selectedProvider.imagegen(prompt);
    }
  };

  return capabilities;
}

function getProvider(provider: 'openai' | 'anthropic' | 'deepseek'): AIProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new Anthropic();
    case 'deepseek':
      return new DeepseekProvider();
    default:
      throw new Error(`Unknown provider: ${provider}. Supported providers: openai, anthropic, deepseek`);
  }
}

function getDefaultProvider(): AIProvider {
  const defaultProvider = process.env.AI_DEFAULT_PROVIDER || 'openai';
  return getProvider(defaultProvider as ProviderParams);
}

export function generateCommitMessage(prompt: string): Promise<string> {
  const provider = getDefaultProvider();
  return provider.textgen(prompt);
}

export function suggestVersion(prompt: string): Promise<string> {
  const provider = getDefaultProvider();
  return provider.textgen(prompt);
}

export { providers, OpenAIProvider, DeepseekProvider, Anthropic };
