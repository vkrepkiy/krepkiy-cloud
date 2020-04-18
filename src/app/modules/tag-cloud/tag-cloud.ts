import { Component, ComponentInterface } from "../core/component";

interface AnimationConfig {
  fontSizeEm: number;
  secForRound: number;
  rotationOffset: number;
  translateX: number;
}

const enum AnimationState {
  default,
  initial,
  second,
}

@Component({
  tag: "vk-tag-cloud",
  template: require("./tag-cloud.html"),
  style: require("./tag-cloud.css"),
  elements: [],
})
export class TagCloudElement extends HTMLElement implements ComponentInterface {
  private containerMinSize: number;
  private items: [HTMLElement, AnimationConfig][];

  componentConnected() {
    // Init props
    this.containerMinSize = Math.min(this.offsetHeight, this.offsetWidth);
    // Setup logic
    this.items = this.getItems();
    this.generateCustomCss(this.items);
  }

  generateCustomCss(items: [HTMLElement, AnimationConfig][]): void {
    const styleSheet = this.shadowRoot!.styleSheets[0] as CSSStyleSheet;

    for (let i = 0; i < this.items.length; i++) {
      let config = items[i][1];

      styleSheet.insertRule(`li:nth-child(${i + 1}) {
        font-size: ${config.fontSizeEm}em;
        animation: rotate_${i} ${config.secForRound}s infinite linear;
      }`);

      styleSheet.insertRule(`@keyframes rotate_${i} {
        from {
          transform: rotate(${config.rotationOffset}deg) translateX(${
        config.translateX
      }px) rotate(-${config.rotationOffset}deg);
        }
        to {
          transform: rotate(${360 + config.rotationOffset}deg) translateX(${
        config.translateX
      }px) rotate(-${360 + config.rotationOffset}deg);
        }
      }`);
    }
  }

  /**
   * Get animated items and configs
   */
  getItems(): [HTMLElement, AnimationConfig][] {
    return Array.from(this.shadowRoot!.querySelectorAll("li")).map((el) => {
      return this.initItem(el);
    });
  }

  initItem(el: HTMLElement): [HTMLElement, AnimationConfig] {
    const config: AnimationConfig = this.getRandomConfig();
    return [el, config];
  }

  getRandomConfig(): AnimationConfig {
    const randomSeed = Math.round(Math.random() * 1000) / 1000;
    return {
      fontSizeEm: Math.max(0.7, randomSeed * 1.5),
      secForRound: Math.min(20, 15 / randomSeed),
      rotationOffset: Math.floor(Math.random() * 360),
      translateX: Math.round(
        Math.max(
          this.containerMinSize / 7,
          Math.round(randomSeed * (this.containerMinSize / 2))
        )
      ),
    };
  }
}

export default TagCloudElement;
