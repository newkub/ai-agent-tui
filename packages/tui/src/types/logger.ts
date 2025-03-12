export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format?: 'json' | 'text';
}
