interface ComponentOptions {
  tag: string;
  template?: string;
  style?: string;
  noEncapsulation?: boolean;
}

export interface ComponentConstructor extends CustomElementConstructor {
  tag: string;
}

/**
 * Shadow dom is totally encapsulated:
 * - css is encapsulated
 * - html cannot be accessed from outside
 */
function attachAsShadowDom(
  instance: HTMLElement,
  html: string = "",
  css?: string
) {
  const template = document.createElement("template");
  template.innerHTML = html;

  if (css) {
    const style = document.createElement("style");
    style.textContent = css;
    template.content.appendChild(style);
  }

  instance
    .attachShadow({ mode: "open" })
    .appendChild(template.content.cloneNode(true));
}

/**
 * Inner HTML has no encapsulation at all:
 * - styles are global
 * - html can be accessed as usual
 */
function attachAsInnerHtml(
  instance: HTMLElement,
  html: string = "",
  css?: string
) {
  const template = document.createElement("template");
  template.innerHTML = html;
  instance.innerHTML = "";

  if (css) {
    const style = document.createElement("style");
    style.textContent = css;
    template.content.appendChild;
  }

  instance.appendChild(template.content.cloneNode(true));
}

function publish(
  Class: CustomElementConstructor,
  options: ComponentOptions
): CustomElementConstructor {
  let DecoratedComponent: CustomElementConstructor;

  if (!customElements.get(options.tag)) {
    DecoratedComponent = getDecorated(Class, options);
    customElements.define(options.tag, DecoratedComponent);
  } else {
    DecoratedComponent = customElements.get(options.tag);
  }

  return DecoratedComponent;
}

/**
 * Get extended Class
 */
function getDecorated(
  Class: CustomElementConstructor,
  options: ComponentOptions
): CustomElementConstructor {
  return class ClassComponent extends Class {
    constructor() {
      super();
    }

    connectedCallback() {
      // TODO: Should it be done here or when is attached to DOM ?
      if (options.noEncapsulation) {
        attachAsInnerHtml(this, options.template, options.style);
      } else {
        attachAsShadowDom(this, options.template, options.style);
      }
    }
  };
}

/**
 * Create component with template and style
 */
export function Component(options: ComponentOptions) {
  return function <T extends CustomElementConstructor>(
    Class: T
  ): T & ComponentConstructor {
    let Element: CustomElementConstructor;

    if (!customElements.get(options.tag)) {
      Element = getDecorated(Class, options);
      publish(Element, options);
    } else {
      Element = customElements.get(options.tag);
    }

    return Object.assign(Element, {
      tag: options.tag,
    }) as T & ComponentConstructor;
  };
}

/**
 * TODO: there should be typings somewhere, use them
 */
export interface ComponentInterface extends HTMLElement {
  connectedCallback?();
  disconnectedCallback?();
  adoptedCallback?();
  attributeChangedCallback?(name: string, oldValue: any, newValue: any);
}
