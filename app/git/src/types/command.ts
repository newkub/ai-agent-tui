export type Command = 'commit' | 'log' | 'release';

export interface CommandResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface CommandError {
  code: string;
  message: string;
  details?: unknown;
}

export interface CommandConfig {
  verbose: boolean;
  dryRun: boolean;
  interactive: boolean;
}

export type CommandHandler = () => Promise<CommandResponse>;