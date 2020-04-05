import { ILogger } from "../logger";
import { info, error, trace, debug, warn } from "loglevel";

export class Logger implements ILogger {
  public error(...msg: string[]): void {
    error(...msg);
  }

  public info(...msg: string[]): void {
    info(...msg);
  }

  public trace(...msg: string[]): void {
    trace(...msg);
  }

  public debug(...msg: string[]): void {
    debug(...msg);
  }

  public warn(...msg: string[]): void {
    warn(...msg);
  }
}
