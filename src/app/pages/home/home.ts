import { Component, ComponentInterface } from "../../modules/core/component";
import anime from "animejs";
import { CatElement } from "../../modules/cat/cat";

@Component({
  tag: "vk-home",
  template: require("./home.html"),
  style: require("./home.css"),
  elements: [CatElement],
})
export class HomeElement extends HTMLElement implements ComponentInterface {
  componentConnected() {
    const titleEl = this.shadowRoot!.querySelector("h1");
    const welcomeTextEl = this.shadowRoot!.querySelector(".welcome-text");
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim();

    anime.set(welcomeTextEl, {
      height: 0,
      scaleY: 0,
      scaleX: 0,
    });

    anime
      .timeline()
      .add({
        targets: titleEl,
        color: accentColor,
        duration: 400,
        delay: 100,
        easing: "easeOutSine",
      })
      .add({
        targets: welcomeTextEl,
        height: "100%",
        duration: 500,
        easing: "easeOutQuart",
      })
      .add({
        targets: welcomeTextEl,
        scaleY: 0.02,
        scaleX: 1,
        duration: 400,
      })
      .add({
        targets: welcomeTextEl,
        scaleY: 1,
        duration: 600,
      });
  }
}

export default HomeElement;
