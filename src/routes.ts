import { RouteConfig } from "./modules/core/router/router";

export const routerConfig: RouteConfig[] = [
  {
    path: "",
    component: function () {
      return import(
        /* webpackMode: "lazy" */
        `./pages/home/home`
      );
    },
  },
  /**
   * This router entry allows router to use lazy load for 'pages' sections
   */
  {
    path: "pages/:name",
    component: function (route) {
      return import(
        /* webpackMode: "lazy" */
        /* webpackInclude: /\.ts/ */
        `./pages/${route.params.name}/${route.params.name}`
      );
    },
  },
];
