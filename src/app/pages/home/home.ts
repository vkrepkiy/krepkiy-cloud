import { Component, ComponentInterface } from "../../modules/core/component";
import anime from "animejs";

const grid = [50, 50];
const gridItems = grid[0] * grid[1];

@Component({
  tag: "vk-home",
  template: require("./home.html"),
  style: require("./home.css"),
})
export class HomeElement extends HTMLElement implements ComponentInterface {
  componentConnected() {
    anime({
      targets: this.shadowRoot!.querySelector("h1"),
      translateX: "0vw",
      rotate: "1turn",
      duration: 2000,
      delay: 0,
    });
  }
}

export default HomeElement;
