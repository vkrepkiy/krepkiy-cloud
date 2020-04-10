import { Router } from "./router";
import { RouterOutletElement } from "./router-element";

describe("Router", () => {
  it("should get valid path", () => {
    expect(Router.normalizePath("////path//12")).toBe("/path/12");
    expect(Router.normalizePath("")).toBe("/");
    expect(Router.normalizePath("/")).toBe("/");
    expect(Router.normalizePath("/path/:with///:id")).toBe("/path/:with/:id");
  });

  it("should extract params from location.href", () => {
    expect(Router.extractParams("/my/route/:id", "/my/route/12?query")).toEqual(
      {
        id: "12",
      }
    );
    expect(Router.extractParams("/my/route/:id", "/my/route/")).toEqual({
      id: null,
    });
    expect(Router.extractParams("/my/route/:id", "/my/route")).toEqual({
      id: null,
    });
    expect(Router.extractParams("/my/route/:id", "")).toEqual({
      id: null,
    });
  });

  it("should remove origin", () => {
    expect(Router.removeOrigin("http://my.domain/thats/the/path")).toBe(
      "/thats/the/path"
    );
    expect(Router.removeOrigin("http://0.0.0.0:9000/thats/the/path")).toBe(
      "/thats/the/path"
    );
    expect(Router.removeOrigin("/thats/the/path")).toBe("/thats/the/path");
  });

  it("should navigate correctly", () => {
    const router = new Router();
    const renderSpyOn = spyOn(router as any, "renderComponentToOutlet");
    const spy = spyOn(router, "navigateByConfig").and.callThrough();
    const route = {
      path: "/my/:component",
      component: (data) => {
        expect(data).toEqual({
          params: {
            component: "blog",
          },
        });
        return Promise.resolve() as any;
      },
    };

    router.bindOutlet(RouterOutletElement.defaultOutletKey, {
      clear: () => {},
    } as any);
    router.setRoutes([route]);

    expect(spy).toBeCalledTimes(0);

    router.navigate("/my/blog");
    expect(spy).toBeCalledWith(route, "/my/blog");
  });
});
