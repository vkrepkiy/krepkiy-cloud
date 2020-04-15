/**
 * Common decorator helps to write less code in each module
 * TODO: find out the best way to share it across all modules, bundle (speed?) or separate as shared code (reduce bundle size)
 */
import { Component, ComponentInterface } from "./modules/core/component";
import { Router } from "./modules/core/router/router";
import { routerConfig } from "./routes";

@Component({
  tag: "vk-app",
  /**
   * Html and css inlined, and it's okay here because this data is required to bootstrap app
   */
  template: require("./app.html"),
  style: require("./app.css"),
})
export class AppElement extends HTMLElement implements ComponentInterface {
  protected router: Router = new Router();

  protected initialContent: Node;

  constructor() {
    super();

    this.router.setRoutes(routerConfig);
  }

  componentConnected() {
    // Trigger initial navigation event
    this.router.navigate(location.pathname, "", true);
  }
}
