declare module 'node-fzf' {
  interface FzfOptions {
    mode?: string;
    height?: number;
    list?: string[];
    query?: string;
    selectOne?: boolean;
    prelinehook?: (index: number) => string;
    postlinehook?: (index: number) => string;
  }

  interface FzfSelected {
    split(arg0: string): unknown;
    value: string;
    index: number;
  }

  interface FzfResult {
    selected: FzfSelected | null;
    query: string;
  }

  function nodeFzf(
    listOrOptions: string[] | FzfOptions,
    callback?: (result: FzfResult) => void
  ): Promise<FzfResult>;

  namespace nodeFzf {
    function getInput(label: string, callback?: (result: { query: string }) => void): Promise<{ query: string }>;
  }

  export = nodeFzf;
}
