import { Singleton } from "./singleton";
import { ComponentConstructor } from "./component";

interface RouteParams {
  [key: string]: string;
}

interface RouteData {
  params: RouteParams;
}

type LazyComponent = <T extends ComponentConstructor>(
  data: RouteData
) => Promise<{ default: T }>;

interface RouteConfig {
  path: string;
  component: LazyComponent | ComponentConstructor;
}

export class Router extends Singleton {
  public static readonly outletNodeName: string = "router-outlet";
  public static readonly outletKeyAttrName: string = "key";
  public baseHref: string;
  public activeRoute: RouteConfig | null;

  protected routes: RouteConfig[];

  protected singletonInit() {
    this.activeRoute = null;
    this.baseHref = "/";
    window.addEventListener("click", (e) => this.onWindowClick(e));
    window.addEventListener("popstate", (e) => {
      console.log(e);
      this.navigate(location.pathname, "", true);
    });
  }

  /**
   * Should load correct component to outlet and update history
   */
  public navigate(href: string, key?: string, doNotPushState?: boolean): void {
    const routeConfig = this.findRouteConfig(href);

    if (routeConfig === this.activeRoute) {
      return;
    }

    this.activeRoute = routeConfig;

    if (routeConfig) {
      this.loadComponent(this.getOutlet(key), routeConfig).then(() => {
        if (!doNotPushState) {
          window.history.pushState(null, null, this.getHref(href));
        }
      });
    } else {
      this.getOutlet(key).innerHTML = "";
      if (!doNotPushState) {
        window.history.pushState(null, null, this.getHref(href));
      }
    }
  }

  public loadComponent(outlet: HTMLElement, config: RouteConfig): Promise<any> {
    if (config.component instanceof Function) {
      return (config.component as LazyComponent)({
        params: {
          name: "blog",
        },
      }).then((module) => {
        this.renderComponentTo(outlet, module.default);
        return Promise.resolve();
      });
    }

    this.renderComponentTo(outlet, config.component as ComponentConstructor);
    return Promise.resolve();
  }

  public setRoutes(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  protected renderComponentTo(
    container: HTMLElement,
    Element: ComponentConstructor
  ): void {
    container.innerHTML = "";
    container.appendChild(document.createElement(Element.tag));
  }

  protected findRouteConfig(path: string): RouteConfig | null {
    let match: RouteConfig | null = null;
    const requestedUrl = this.getUrlParts(path);

    for (
      let requestedIndex = 0;
      requestedIndex < requestedUrl.parts.length;
      requestedIndex++
    ) {
      for (let x = 0; x < this.routes.length; x++) {
        match = this.routes[x];
        const url = this.getUrlParts(match.path);

        if (url.parts[requestedIndex][0] === ":") {
          break;
        }

        if (requestedUrl.parts[requestedIndex] !== url.parts[requestedIndex]) {
          match = null;
          break;
        }
      }
    }

    return match;
  }

  protected getUrlParts(path: string) {
    let [pathname, _search] = path.split("?");
    let [search, hash] = (_search || "").split("#");
    let parts = pathname.split("/").filter((x) => x);

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

  protected getOutlet(key?: string): HTMLElement {
    return document.querySelector(
      key
        ? `${Router.outletNodeName}[${Router.outletKeyAttrName}=${key}]`
        : Router.outletNodeName
    );
  }

  protected onWindowClick(e: MouseEvent) {
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
