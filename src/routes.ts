import { RouteConfig } from "./modules/core/router/router";

export const routerConfig: RouteConfig[] = [
  /**
   * First page should be included in bootstrap bundle to prevent visible content update
   */
  {
    path: "",
    component: function () {
      return import(
        /* webpackMode: "eager" */
        `./pages/home/home`
      );
    },
  },
  /**
   * Other pages should be lazy-loaded.
   */
  {
    path: "pages/:name",
    component: function (route) {
      return import(
        /* webpackMode: "lazy-once" */
        /* webpackInclude: /\.ts/ */
        `./pages/${route.params.name}/${route.params.name}`
      );
    },
  },
];
