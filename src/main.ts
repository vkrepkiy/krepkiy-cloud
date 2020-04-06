/**
 * Common decorator helps to write less code in each module
 * TODO: find out the best way to share it across all modules, bundle (speed?) or separate as shared code (reduce bundle size)
 */
import { Component, ComponentInterface } from "./modules/core/component";
import { Router } from "./modules/core/router/router";
import { routerConfig } from "./routes";
import MainMenuElement from "./modules/main-menu/main-menu";

@Component({
  tag: "vk-main",
  /**
   * Html and css inlined, and it's okay here because this data is required to bootstrap app
   */
  template: require("./main.html"),
  style: require("./main.css"),
  dependencies: [MainMenuElement],
})
export class MainElement extends HTMLElement implements ComponentInterface {
  protected router: Router = new Router();

  constructor() {
    super();

    this.router.setRoutes(routerConfig);
  }

  componentConnected() {
    // Trigger initial navigation event
    this.router.navigate(location.pathname, "", true);
  }
}
