import {
  Component,
  ComponentInterface,
  ComponentConstructor,
} from "../component";
import { Router } from "./router";

const nodeName = "router-outlet";
const attrIdName = "data-outlet-id";

@Component({
  tag: nodeName,
})
export class RouterOutletElement extends HTMLElement
  implements ComponentInterface {
  public static tag: string;
  public static attrIdName: string = attrIdName;
  public static defaultOutletKey: string = "default";
  public router = new Router();

  #initialContent: string;

  public componentBeforeConnected() {
    // Store existing content
    this.#initialContent = this.innerHTML;
  }

  public componentConnected() {
    // Move #initialContent to shadowRoot
    this.shadowRoot!.innerHTML = this.#initialContent;
    this.innerHTML = "";

    this.router.bindOutlet(
      this.getAttribute(RouterOutletElement.attrIdName) ||
        RouterOutletElement.defaultOutletKey,
      this
    );
  }

  public attachComponent(Component: ComponentConstructor): void {
    this.shadowRoot!.innerHTML = "";
    this.shadowRoot!.appendChild(Component.template);
  }

  public clear(): void {
    this.shadowRoot!.innerHTML = "";
  }
}
