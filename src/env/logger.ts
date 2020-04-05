import { Logger } from "@env/logger";

export interface ILogger {
  error(...msg: string[]): void;

  info(...msg: string[]): void;

  trace(...msg: string[]): void;

  debug(...msg: string[]): void;

  warn(...msg: string[]): void;
}

export const logger = new Logger();
