import { Component } from "../../modules/core/component";
import { Router } from "../../modules/core/router/router";

@Component({
  tag: "vk-home",
  template: require("./home.html"),
  style: require("./home.css"),
})
export class HomeElement extends HTMLElement {
  constructor(public router: Router = new Router()) {
    super();
  }
}

export default HomeElement;
