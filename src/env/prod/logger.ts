import { ILogger } from "../logger";

export class Logger implements ILogger {
  public error(...msg: string[]): void {}

  public info(...msg: string[]): void {}

  public trace(...msg: string[]): void {}

  public debug(...msg: string[]): void {}

  public warn(...msg: string[]): void {}
}
