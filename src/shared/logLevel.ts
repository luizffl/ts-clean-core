export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace",
}

export const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.INFO;
