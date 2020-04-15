/**
 * Common decorator helps to write less code in each module
 * TODO: find out the best way to share it across all modules, bundle (speed?) or separate as shared code (reduce bundle size)
 */
import { Component, ComponentInterface } from "./modules/core/component";
import { Router } from "./modules/core/router/router";
import { routerConfig } from "./routes";
import MainMenuElement from "./modules/main-menu/main-menu";
import anime from "animejs";

@Component({
  tag: "vk-app",
  /**
   * Html and css inlined, and it's okay here because this data is required to bootstrap app
   */
  template: require("./app.html"),
  style: require("./app.css"),
  elements: [MainMenuElement],
})
export class AppElement extends HTMLElement implements ComponentInterface {
  protected router: Router = new Router();

  protected initialContent: Node;

  constructor() {
    super();

    this.router.setRoutes(routerConfig);
  }

  componentConnected() {
    this.animateMenu(this.shadowRoot!.querySelector("vk-main-menu"));

    // Trigger initial navigation event
    this.router.navigate(location.pathname, "", true);
  }

  animateMenu(el: Element | null) {
    if (!el) {
      return;
    }

    anime.set(el, {
      opacity: "0",
    });

    anime({
      targets: el,
      easing: "linear",
      opacity: "1",
      duration: 1000,
      delay: 0,
    });
  }
}
