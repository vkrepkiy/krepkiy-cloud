import { Component, ComponentInterface } from "../core/component";

@Component({
  tag: "vk-cat",
  template: require("./cat.html"),
  style: require("./cat.css"),
})
export class CatElement extends HTMLElement implements ComponentInterface {
  items?: NodeListOf<HTMLDivElement>;

  visibleFrameIndex: number = 0;

  lastAnimationFrameTs: number;

  animationRateMs = 600;

  componentConnected() {
    this.items = this.shadowRoot!.querySelectorAll("div");

    this.items.forEach((div) => (div.hidden = true));

    requestAnimationFrame(this.animationFrame);
  }

  animationFrame = (timestamp) => {
    if (!this.lastAnimationFrameTs) {
      this.lastAnimationFrameTs = performance.now();
    }

    if (timestamp - this.lastAnimationFrameTs > this.animationRateMs) {
      this.items!.item(this.visibleFrameIndex++).hidden = true;

      if (this.visibleFrameIndex >= this.items!.length) {
        this.visibleFrameIndex = 0;
      }

      this.items!.item(this.visibleFrameIndex).hidden = false;

      this.lastAnimationFrameTs = timestamp;
    }

    requestAnimationFrame(this.animationFrame);
  };
}
