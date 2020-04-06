import { Router } from "./router/router";

interface ComponentOptions {
  tag: string;
  template?: string;
  style?: string;
  dependencies?: CustomElementConstructor[];
}

/**
 * TODO: there should be typings somewhere, use them
 */
export interface ComponentInterface extends HTMLElement {
  /**
   * Called when component is connected
   */
  componentConnected?();

  /**
   * Called before execution of connectedCallback()
   */
  componentBeforeConnected?();
  /**
   * Called when component is disconnected
   */
  componentDisonnected?();
  /**
   * Called when component is adopted by Element
   */
  componentAdopted?();

  /**
   * Called when component attributes are changed
   */
  componentChanged?(name: string, oldValue: any, newValue: any);
}

export interface ComponentConstructor {
  new (): ComponentInterface;
  tag: string;
  template: Node;
}

/**
 * Register at customElements registry
 */
function register(
  Class: { new (): ComponentInterface },
  options: ComponentOptions
): ComponentConstructor {
  let DecoratedComponent: ComponentConstructor;

  if (!customElements.get(options.tag)) {
    DecoratedComponent = getDecoratedClass(Class, options);
    customElements.define(options.tag, DecoratedComponent);
  } else {
    DecoratedComponent = customElements.get(options.tag);
  }

  return DecoratedComponent;
}

/**
 * Get extended Class
 */
function getDecoratedClass(
  Class: { new (): ComponentInterface },
  options: ComponentOptions
): ComponentConstructor {
  return class ClassComponent extends Class {
    public static tag = options.tag;

    public static get template(): Node {
      const template = document.createElement("template");
      template.innerHTML = options.template || "";

      if (options.style) {
        const style = document.createElement("style");
        style.textContent = options.style;
        template.content.appendChild(style);
      }

      return template.content.cloneNode(true);
    }

    connectedCallback() {
      if (!this.isConnected) {
        return;
      }

      if (this.componentBeforeConnected) {
        this.componentBeforeConnected();
      }

      this.innerHTML = "";

      this.attachShadow({ mode: "open" }).appendChild(ClassComponent.template);

      this.shadowRoot!.addEventListener("click", (e: MouseEvent) => {
        new Router().handleMouseEvent(e);
      });

      if (this.componentConnected) {
        this.componentConnected();
      }
    }

    disconnectedCallback() {
      if (this.componentDisonnected) {
        this.componentDisonnected();
      }
    }

    adoptedCallback() {
      if (this.componentAdopted) {
        this.componentAdopted();
      }
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      if (this.componentChanged) {
        this.componentChanged(name, oldValue, newValue);
      }
    }
  };
}

/**
 * Create component with template and style
 */
export function Component(options: ComponentOptions) {
  return function <T extends CustomElementConstructor>(Class: T): T {
    let Element: CustomElementConstructor;

    if (!customElements.get(options.tag)) {
      Element = getDecoratedClass(Class, options);
      register(Element, options);
    } else {
      Element = customElements.get(options.tag);
    }

    return Element as T;
  };
}
