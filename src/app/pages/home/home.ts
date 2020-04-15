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
    const titleEl = this.shadowRoot!.querySelector("h1");
    const welcomeTextEl = this.shadowRoot!.querySelector(".welcome-text");
    const welcomeTextOriginHeight = welcomeTextEl!.clientHeight;
    anime({
      targets: titleEl,
      translateX: "0vw",
      rotate: "1turn",
      duration: 1000,
      delay: 0,
    });

    anime.set(this.shadowRoot!.querySelector(".welcome-text"), {
      height: 0,
    });

    anime({
      targets: welcomeTextEl,
      height: welcomeTextOriginHeight,
      duration: 2000,
      delay: 0,
    });
  }
}

export default HomeElement;
