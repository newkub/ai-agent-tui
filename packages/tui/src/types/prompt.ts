export interface InputOptions {
  message: string;
  initial?: string;
  validate?: (value: string) => true | string;
}

export type InputFunction = (options: InputOptions) => Promise<string>;
export type ConfirmFunction = (message: string, initial?: boolean) => Promise<boolean>;
export type SelectFunction = <T extends string>(message: string, choices: T[]) => Promise<T>;
export type MultiselectFunction = <T extends string>(message: string, choices: T[]) => Promise<T[]>;
