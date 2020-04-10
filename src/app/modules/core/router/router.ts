import { Singleton } from "../singleton";
import { ComponentConstructor } from "../component";
import { RouterOutletElement } from "./router-element";

interface RouteParams {
  [key: string]: string;
}

interface RouteData {
  params: RouteParams;
}

type LazyComponent = <T extends ComponentConstructor>(
  data: RouteData
) => Promise<{ default: T }>;

export interface RouteConfig {
  path: string;
  component: LazyComponent | ComponentConstructor;
}

export class Router extends Singleton {
  public baseHref: string;
  public currentPath: string;

  protected config: RouteConfig[];

  protected outlets: { [key: string]: RouterOutletElement };

  public static removeOrigin(url: string): string {
    return url.replace(/.*\:\/\/.+?\//, "/");
  }

  public static removeHashOrQuery(url: string): string {
    const queryorHashStart = url
      .split("")
      .findIndex((i) => i === "?" || i === "#");

    if (queryorHashStart > -1) {
      url = url.slice(0, queryorHashStart);
    }

    return url;
  }

  public static extractParams(
    path: string,
    extractFrom: string
  ): { [key: string]: string } {
    const pathParts = Router.normalizePath(path).split("/");
    const currentData = Router.normalizePath(
      Router.removeHashOrQuery(extractFrom)
    ).split("/");

    return pathParts.reduce((result, part, i) => {
      if (part[0] === ":") {
        result[part.slice(1)] = currentData[i] || null;
      }

      return result;
    }, {});
  }

  public static normalizePath(path: string): string {
    return `/${path}`.replace(/\/{2,}/g, "/");
  }

  public handleLinkClickEvent(e: MouseEvent) {
    if (!(e.target instanceof HTMLAnchorElement) || !e.target.href) {
      return;
    }

    /**
     * Ignore outer links
     */
    if (!this.sameOrigin(e.target.origin)) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    this.navigate(Router.removeOrigin(e.target.href));
  }

  /**
   * Should load correct component to outlet and update history
   */
  public navigate(
    href: string,
    outletKey?: string,
    doNotPushState?: boolean
  ): void {
    href = Router.normalizePath(href);
    outletKey = outletKey || RouterOutletElement.defaultOutletKey;

    if (href === this.currentPath) {
      return;
    }

    const routeConfig = this.findRouteConfig(href);
    const outlet = this.getOutlet(outletKey);

    if (!outlet) {
      return;
    }

    this.currentPath = href;

    if (!routeConfig) {
      outlet.clear();
      if (!doNotPushState) {
        window.history.pushState(null, "", href);
      }

      return;
    }

    this.navigateByConfig(routeConfig, href).then((Component) => {
      if (!doNotPushState) {
        window.history.pushState(null, "", href);
      }

      this.renderComponentToOutlet(outlet, Component);
    });
  }

  /**
   * Load component from RouteConfig
   */
  public navigateByConfig(
    config: RouteConfig,
    href: string
  ): Promise<ComponentConstructor> {
    if (config.component instanceof Function) {
      return (config.component as LazyComponent)({
        params: Router.extractParams(config.path, href),
      }).then((module) => {
        return Promise.resolve(module.default);
      });
    }
    return Promise.resolve(config.component);
  }

  public setRoutes(routes: RouteConfig[]): void {
    this.config = routes;
  }

  public bindOutlet(key: string, outlet: RouterOutletElement): void {
    if (outlet) {
      this.outlets[key] = outlet;
    } else {
      delete this.outlets[key];
    }
  }

  protected singletonInit() {
    /**
     * Initialize router state:
     */
    this.currentPath = "";
    this.outlets = {};
    this.baseHref = document.baseURI;

    /**
     * Navigate on any popstate event (support simple links and history)
     */
    window.addEventListener("popstate", (e) => {
      this.navigate(location.pathname, "", true);
    });
  }

  protected renderComponentToOutlet(
    outlet: RouterOutletElement,
    Element: ComponentConstructor
  ): void {
    outlet.attachComponent(Element);
  }

  protected findRouteConfig(path: string): RouteConfig | null {
    const requestedUrl = Router.removeHashOrQuery(path).split("/").slice(1);

    // Iterate over router config
    for (let configIndex = 0; configIndex < this.config.length; configIndex++) {
      let intermediateResult: RouteConfig | null = null;
      const configPath = Router.normalizePath(
        Router.removeHashOrQuery(this.config[configIndex].path)
      )
        .split("/")
        .slice(1);

      // Iterate for each config over url parts
      for (
        let requestedIndex = 0;
        requestedIndex < requestedUrl.length;
        requestedIndex++
      ) {
        if (configPath[requestedIndex] === undefined) {
          intermediateResult = null;
          break;
        }
        // Param can be only the last item and it equels any non-empty value
        if (configPath[requestedIndex][0] === ":") {
          if (!requestedUrl[requestedIndex]) {
            intermediateResult = null;
          }
          break;
        }

        if (requestedUrl[requestedIndex] === configPath[requestedIndex]) {
          intermediateResult = this.config[configIndex];
          break;
        } else {
          intermediateResult = null;
        }
      }

      if (intermediateResult) {
        return intermediateResult;
      }
    }

    return null;
  }

  protected getOutlet(
    key: string = RouterOutletElement.defaultOutletKey
  ): RouterOutletElement | null {
    return this.outlets[key] || null;
  }

  protected sameOrigin(origin: string): boolean {
    return !origin || document.location.origin === origin;
  }
}
