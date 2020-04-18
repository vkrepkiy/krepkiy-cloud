import { Component, ComponentInterface } from "../core/component";

interface AnimationConfig {
  scale: number;
  speed: number;
  rotation: number;
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
  public calculateEachMs = 2000;
  public rotateDegreePerSecond = 4;
  public rotateDegreePerFrame =
    Math.round(
      (this.rotateDegreePerSecond / (1000 / this.calculateEachMs)) * 10
    ) / 10;

  private containerMinSize: number;
  private items: [HTMLElement, AnimationConfig][];
  private lastAnimationFrameTs: number = -1 - this.calculateEachMs;

  componentConnected() {
    // Init props
    this.containerMinSize = Math.min(this.offsetHeight, this.offsetWidth);
    // Setup logic
    this.items = this.getItems();
    // Run animation with first-time flag
    requestAnimationFrame((time) =>
      this.requestAnimationFrame(time, AnimationState.initial)
    );
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
    const config: AnimationConfig = this.getRandomConfig(el);
    return [el, config];
  }

  getRandomConfig(el: HTMLElement): AnimationConfig {
    const randomSeed = Math.round(Math.random() * 1000) / 1000;
    el.style.fontSize = `${Math.max(0.5, randomSeed * 1.4)}em`;
    return {
      scale: Math.max(0.7, randomSeed * 5),
      speed: Math.max(5, randomSeed * 10),
      rotation: Math.floor(Math.random() * 360),
      translateX: Math.round(
        Math.max(
          this.containerMinSize / 5,
          Math.round(randomSeed * (this.containerMinSize / 2))
        )
      ),
    };
  }

  transformEl(el, config: AnimationConfig): void {
    el.style.transform = `rotate(${config.rotation}deg) translateX(${config.translateX}px) rotate(-${config.rotation}deg)`;
  }

  /**
   * This method mutates config object, be aware
   */
  updateConfigForNextFrame(config: AnimationConfig): AnimationConfig {
    config.rotation =
      config.rotation + this.rotateDegreePerFrame * config.speed;
    return config;
  }

  runAnimationUpdate(setTransitions?: boolean) {
    for (const [el, config] of this.items) {
      if (setTransitions) {
        this.setTransition(el);
      }
      this.transformEl(el, this.updateConfigForNextFrame(config));
    }
  }

  // CSS transition is great for smoothing rare js calculations
  setTransition(el: HTMLElement): void {
    el.style.transition = `all linear ${this.calculateEachMs / 1000}s`;
  }

  /**
   * First draw should be done without smoothing (if we don't want "appearing" effect).
   * Second animation update should be done strictly on next animationFrame
   * after applying transition property
   */
  requestAnimationFrame = (time: number, state?: AnimationState): void => {
    // Make sure first animation frame will be rendered on time
    if (state === AnimationState.initial) {
      this.runAnimationUpdate();
      requestAnimationFrame((time) =>
        this.requestAnimationFrame(time, AnimationState.second)
      );
      return;
    } else if (state === AnimationState.second) {
      this.runAnimationUpdate(true);
      this.lastAnimationFrameTs = time;
    } else if (
      time - this.lastAnimationFrameTs > this.calculateEachMs &&
      document.visibilityState !== "hidden"
    ) {
      this.runAnimationUpdate();
      this.lastAnimationFrameTs = time;
    }

    requestAnimationFrame(this.requestAnimationFrame);
  };
}

export default TagCloudElement;
