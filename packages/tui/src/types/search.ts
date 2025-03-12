export interface FzfOptions {
  list: string[];
  prompt?: string;
  height?: number;
  multiSelect?: boolean;
}

export interface FzfResult {
  value: string;
  index: number;
}
