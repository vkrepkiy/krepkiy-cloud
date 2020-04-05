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
export class RouterElement extends HTMLElement implements ComponentInterface {
  public static tag: string;
  public static attrIdName: string = attrIdName;
  public router = new Router();

  public attachComponent(Component: ComponentConstructor): void {
    this.shadowRoot!.innerHTML = "";
    this.shadowRoot!.appendChild(Component.template);
    this.shadowRoot!.addEventListener("click", (e: MouseEvent) =>
      this.router.mouseClicked(e)
    );
  }

  public clear(): void {
    this.shadowRoot!.innerHTML = "";
  }
}
