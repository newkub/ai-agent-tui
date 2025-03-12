import type { Capabilities } from './capabilities';

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
}

export type ProviderMap = Record<string, new (config: ProviderConfig) => Capabilities>;

export type Providers = {
  (): Capabilities;
  (provider: ProviderConfig): Capabilities;
};
