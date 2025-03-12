declare module 'node-fzf' {
  interface FzfOptions {
    list: string[];
    mode?: 'fuzzy' | 'normal';
    query?: string;
    selectOne?: boolean;
    height?: number;
    prelinehook?: (index: number) => string;
    postlinehook?: (index: number) => string;
    multiSelect?: boolean;
  }

  interface FzfResult {
    selected: {
      value: string;
      index: number;
    }[] | null;
    query: string;
  }

  interface FzfApi {
    update(list: string[]): void;
  }

  export default function fzf(options: FzfOptions): Promise<FzfResult>;
  export default function fzf(list: string[], callback: (result: FzfResult) => void): FzfApi;
  export function getInput(label: string): Promise<string>;
  export function getInput(label: string, callback: (query: string) => void): void;
}
