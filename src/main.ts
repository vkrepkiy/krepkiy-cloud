/**
 * Common decorator helps to write less code in each module
 * TODO: find out the best way to share it across all modules, bundle (speed?) or separate as shared code (reduce bundle size)
 */
import { Component, ComponentInterface } from "./modules/utils/component";
import { Router } from "./modules/utils/router";

/**
 * Html and css inlined, and it's okay here because this data is required to bootstrap app
 */
const htmlSrc: string = require("./main.html");
const cssSrc: string = require("./main.css");

@Component({
  tag: "vk-app",
  template: htmlSrc,
  style: cssSrc,
  noEncapsulation: true, // Our simple router won't work with shadow dom, so no encapsulation is used
})
export class ApplicationElement extends HTMLElement
  implements ComponentInterface {
  public router: Router;

  constructor() {
    super();

    this.router = new Router();
    this.router.setRoutes([
      {
        path: "pages/:name",
        component: function (route) {
          /**
           * This entry allows router to use lazy load for component
           */
          return import(
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.ts/ */
            `./pages/${route.params.name}/${route.params.name}`
          );
        },
      },
    ]);
  }
}
