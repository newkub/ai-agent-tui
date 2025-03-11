export type Provider = 'openai' | 'anthropic' | 'gemini';

export type ProviderHandler = (message: string) => Promise<string>;
