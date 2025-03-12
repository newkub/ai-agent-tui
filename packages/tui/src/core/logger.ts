import type { LogEntry, LoggerConfig } from '../types/logger';
import { color } from './color';

class Logger {
  private config: LoggerConfig;
  private readonly levelHierarchy = ['debug', 'info', 'warn', 'error'];

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.shouldLog('debug') && this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.shouldLog('info') && this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.shouldLog('warn') && this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  private shouldLog(level: LogEntry['level']): boolean {
    const configLevelIndex = this.levelHierarchy.indexOf(this.config.level);
    const currentLevelIndex = this.levelHierarchy.indexOf(level);
    return currentLevelIndex >= configLevelIndex;
  }

  private log(level: LogEntry['level'], message: string, context?: Record<string, unknown>): void {
    const timestamp = new Date();
    const entry: LogEntry = { level, message, timestamp, context };
    
    if (this.config.format === 'json') {
      console.log(JSON.stringify(entry));
      return;
    }

    const formattedTime = timestamp.toISOString();
    const coloredLevel = this.colorize(level.toUpperCase(), level);

    console.log(`${formattedTime} ${coloredLevel} ${message}`);
    if (context) {
      console.log(color.dim(JSON.stringify(context, null, 2)));
    }
  }

  private colorize(text: string, level: LogEntry['level']): string {
    switch (level) {
      case 'debug':
        return color.blue(text);
      case 'info':
        return color.green(text);
      case 'warn':
        return color.yellow(text);
      case 'error':
        return color.red(text);
    }
  }
}

function createLogger(config: LoggerConfig): Logger {
  return new Logger(config);
}

export { Logger, createLogger };
