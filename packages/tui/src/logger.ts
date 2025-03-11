import { fg } from './color';

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

type LoggerConfig = {
  level: LogLevel;
};

const LOG_FORMATS = {
  debug: (msg: string) => fg('gray')(`[debug] ${msg}`),
  info: (msg: string) => fg('cyan')(`[info] ${msg}`),
  success: (msg: string) => fg('green')(`[success] ${msg}`),
  warn: (msg: string) => fg('yellow')(`[warn] ${msg}`),
  error: (msg: string) => fg('red')(`[error] ${msg}`)
};

const createLogger = (config: LoggerConfig = { level: LogLevel.INFO }) => {
  let currentLevel = config.level;

  const createLogMethod = (level: LogLevel, formatter: (msg: string) => string) => 
    (message: string, ...meta: unknown[]): void => {
      if (currentLevel <= level) {
        const logFn = level === LogLevel.ERROR ? console.error : console.log;
        logFn(formatter(message), ...meta);
      }
    };

  return {
    setLevel: (level: LogLevel): void => { currentLevel = level; },
    debug: createLogMethod(LogLevel.DEBUG, LOG_FORMATS.debug),
    info: createLogMethod(LogLevel.INFO, LOG_FORMATS.info),
    success: createLogMethod(LogLevel.INFO, LOG_FORMATS.success),
    warn: createLogMethod(LogLevel.WARN, LOG_FORMATS.warn),
    error: createLogMethod(LogLevel.ERROR, LOG_FORMATS.error)
  };
};

export { LogLevel, createLogger };
