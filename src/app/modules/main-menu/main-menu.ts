import { Component, ComponentInterface } from "../../modules/core/component";

@Component({
  tag: "vk-main-menu",
  template: require("./main-menu.html"),
  style: require("./main-menu.css"),
})
export class MainMenuElement extends HTMLElement
  implements ComponentInterface {}

export default MainMenuElement;
