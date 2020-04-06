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
  public activeRoute: RouteConfig | null;

  protected config: RouteConfig[];

  protected outlets: { [key: string]: RouterOutletElement };

  protected singletonInit() {
    this.activeRoute = null;
    this.outlets = {};
    this.baseHref = "/";

    window.addEventListener("popstate", (e) => {
      this.navigate(location.pathname, "", true);
    });
  }

  /**
   * Should load correct component to outlet and update history
   */
  public navigate(href: string, key?: string, doNotPushState?: boolean): void {
    key = key || RouterOutletElement.defaultOutletKey;
    const routeConfig = this.findRouteConfig(href);
    const outlet = this.getOutlet(key);

    if (routeConfig === this.activeRoute || !outlet) {
      return;
    }

    this.activeRoute = routeConfig;

    if (!routeConfig) {
      outlet.clear();
      if (!doNotPushState) {
        window.history.pushState(null, "", this.getHref(href));
      }

      return;
    }

    this.loadComponent(routeConfig).then((Component) => {
      if (!doNotPushState) {
        window.history.pushState(null, "", this.getHref(href));
      }

      this.renderComponentToOutlet(outlet, Component);
    });
  }

  /**
   * Load component from RouteConfig
   */
  public loadComponent(config: RouteConfig): Promise<ComponentConstructor> {
    if (config.component instanceof Function) {
      return (config.component as LazyComponent)({
        params: {
          // TODO: it's hardcoded!!!
          name: "blog",
        },
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

  protected renderComponentToOutlet(
    outlet: RouterOutletElement,
    Element: ComponentConstructor
  ): void {
    outlet.attachComponent(Element);
  }

  protected findRouteConfig(path: string): RouteConfig | null {
    const requestedUrl = this.getUrlParts(path);

    // Iterate over router config
    for (let configIndex = 0; configIndex < this.config.length; configIndex++) {
      let intermediateResult: RouteConfig | null = null;
      const configPath = this.getUrlParts(this.config[configIndex].path);

      // Iterate for each config over url parts
      for (
        let requestedIndex = 0;
        requestedIndex < requestedUrl.parts.length;
        requestedIndex++
      ) {
        if (configPath.parts[requestedIndex] === undefined) {
          intermediateResult = null;
          break;
        }
        // Param can be only the last item and it equels any non-empty value
        if (configPath.parts[requestedIndex][0] === ":") {
          if (!requestedUrl.parts[requestedIndex]) {
            intermediateResult = null;
          }
          break;
        }

        if (
          requestedUrl.parts[requestedIndex] ===
          configPath.parts[requestedIndex]
        ) {
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

  protected getUrlParts(path: string) {
    let [pathname, _search] = path.split("?");
    let [search, hash] = (_search || "").split("#");
    let parts = pathname.split("/").filter((x) => x);

    if (parts.length === 0) {
      parts.push("");
    }

    return {
      pathname,
      search,
      hash,
      parts,
    };
  }

  protected getHref(href: string): string {
    return [this.baseHref, ...href.split("/")]
      .filter((p) => p && p !== "/")
      .join("/");
  }

  protected getOutlet(
    key: string = RouterOutletElement.defaultOutletKey
  ): RouterOutletElement | null {
    return this.outlets[key] || null;
  }

  public handleMouseEvent(e: MouseEvent) {
    if (!(e.target instanceof HTMLAnchorElement) || !e.target.href) {
      return;
    }

    if (!this.sameOrigin(e.target.origin)) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    this.navigate(e.target.href.replace(e.target.origin, ""));
  }

  protected sameOrigin(origin: string): boolean {
    return !origin || document.location.origin === origin;
  }
}
