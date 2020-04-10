/**
 * This type of singleton design has restrictions for constructor and properties imnitialization.
 * Initial logic should be written in singletonInit(), and all assignments should be
 * done through methods
 */
export abstract class Singleton {
  public static instance?: any;

  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }

    this.singletonInit();
    Singleton.instance = this;
  }

  protected singletonInit(): void {}
}
