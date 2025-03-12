export interface Provider {
  id: string;
  name: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface AutocompleteProvider extends Provider {
  autocomplete(query: string): Promise<string[]>;
}

export interface ChatProvider extends Provider {
  chat(messages: { role: string; content: string }[]): Promise<string>;
}

export interface ImageProvider extends Provider {
  generateImage(prompt: string): Promise<string>;
}

export interface SearchProvider extends Provider {
  search(query: string): Promise<string[]>;
}
