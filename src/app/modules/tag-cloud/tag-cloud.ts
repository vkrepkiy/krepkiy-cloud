import { Component, ComponentInterface } from "../core/component";

@Component({
  tag: "vk-tag-cloud",
  template: require("./tag-cloud.html"),
  style: require("./tag-cloud.css"),
  elements: [],
})
export class TagCloudElement extends HTMLElement implements ComponentInterface {
  public targetFps = 60;
  public calculationFps = 2;
  public calculateEachMs = 1000 / this.calculationFps; // should be 500
  public shouldRenderMs = 1000 / this.targetFps; // should be 100
  public smoothForMs = this.calculateEachMs - this.shouldRenderMs; // 400?
  public smoothForSec = Math.round(this.smoothForMs / 10) / 100; // should be 0.4 ??
  public degreePerSec = 5;

  protected items: HTMLElement[];

  private lastAnimationFrameTs = 0;

  componentConnected() {
    this.items = this.initItems();

    requestAnimationFrame(this.requestAnimationFrame);
  }

  initItems(): HTMLElement[] {
    return Array.from(this.shadowRoot!.querySelectorAll("li")).map((el, i) => {
      el.style.position = "absolute";
      el.style.transition = `all linear ${this.smoothForSec}s`;
      return this.setRandomPosition(el, i);
    });
  }

  setRandomPosition(el: HTMLElement, i: number): HTMLElement {
    el.dataset.rotationOffset = Math.floor(Math.random() * 360).toString();
    el.style.transform = `rotate(${el.dataset.rotationOffset}deg) translateX(100%) rotate(-${el.dataset.rotationOffset}deg)`;
    return el;
  }

  runAnimationFrame() {
    for (const el of this.items) {
      let nextVal =
        parseInt(el.dataset.rotationOffset!, 10) + this.degreePerSec;
      el.dataset.rotationOffset = nextVal.toString();
      el.style.transform = `rotate(${nextVal}deg) translateX(100%) rotate(-${nextVal}deg)`;
    }
  }

  requestAnimationFrame = (time: number): void => {
    if (time - this.lastAnimationFrameTs > this.calculateEachMs) {
      this.runAnimationFrame();
      this.lastAnimationFrameTs = time;
    }

    requestAnimationFrame(this.requestAnimationFrame);
  };
}

export default TagCloudElement;
