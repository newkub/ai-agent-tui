export interface BasePrompt<T = unknown> {
  type: string;
  name: string;
  message: string;
  required?: boolean;
}

export interface InputPrompt<T = unknown> extends BasePrompt<T> {
  type: 'input';
  initial?: T;
  validate?: (value: T) => boolean | string;
  placeholder?: string;
}

export interface MultiSelectPrompt<T = unknown> extends BasePrompt<T[]> {
  type: 'multi-select';
  choices: Array<{ value: T; label: string; disabled?: boolean }>;
  initial?: T[];
  min?: number;
  max?: number;
  hint?: string;
  format?: (selected: T[]) => string;
}

export interface SelectPrompt<T = unknown> extends BasePrompt<T> {
  type: 'select';
  choices: Array<{ value: T; label: string; disabled?: boolean }>;
  initial?: T;
  hint?: string;
  format?: (selected: T) => string;
}

export interface ConfirmPrompt extends BasePrompt<boolean> {
  type: 'confirm';
  initial?: boolean;
  hint?: string;
}

export interface PasswordPrompt extends BasePrompt<string> {
  type: 'password';
  initial?: string;
  mask?: string;
  validate?: (value: string) => boolean | string;
}

export interface NumberPrompt extends BasePrompt<number> {
  type: 'number';
  initial?: number;
  min?: number;
  max?: number;
  step?: number;
  validate?: (value: number) => boolean | string;
}

export interface DatePrompt extends BasePrompt<Date> {
  type: 'date';
  initial?: Date;
  min?: Date;
  max?: Date;
  format?: string;
}

export interface AutocompletePrompt<T = unknown> extends BasePrompt<T> {
  type: 'autocomplete';
  choices: Array<{ value: T; label: string; disabled?: boolean }>;
  initial?: T;
  limit?: number;
  suggest?: (input: string, choices: Array<{ value: T; label: string }>) => Promise<Array<{ value: T; label: string }>>;
}

export interface FilePrompt extends BasePrompt<string> {
  type: 'file';
  initial?: string;
  cwd?: string;
  onlyDirs?: boolean;
  onlyFiles?: boolean;
  allowCreate?: boolean;
  extensions?: string[];
}

export interface ProgressPrompt extends BasePrompt<void> {
  type: 'progress';
  total?: number;
  value?: number;
  format?: (value: number, total: number) => string;
  spinner?: string | string[];
}

export type Prompt<T = unknown> = 
  | InputPrompt<T>
  | MultiSelectPrompt<T>
  | SelectPrompt<T>
  | ConfirmPrompt
  | PasswordPrompt
  | NumberPrompt
  | DatePrompt
  | AutocompletePrompt<T>
  | FilePrompt
  | ProgressPrompt;
