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
  public targetFps = 60;
  public calculationFps = 0.25;
  public degreePerFrame = 5; // TODO: should be per sec to remove dependency from calculationFps

  private calculateEachMs = 1000 / this.calculationFps;
  private shouldRenderMs = 1000 / this.targetFps;
  private smoothForMs = this.calculateEachMs - this.shouldRenderMs;
  private smoothForSec = Math.round(this.smoothForMs / 10) / 100;
  private size: number;
  private items: [HTMLElement, AnimationConfig][];
  private lastAnimationFrameTs: number = -1 - this.calculateEachMs;

  componentConnected() {
    // Init props
    this.size = Math.min(this.offsetHeight, this.offsetWidth);
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
    // Speed from 0 to 1
    const randomSeed = Math.round(Math.random() * 1000) / 1000;
    el.style.fontSize = `${Math.max(0.7, randomSeed)}em`;
    return {
      scale: Math.max(0.7, randomSeed * 2),
      speed: Math.max(5, randomSeed * 10),
      rotation: Math.floor(Math.random() * 360),
      translateX: Math.max(100, Math.round(randomSeed * this.size)),
    };
  }

  transformEl(el, config: AnimationConfig): void {
    el.style.transform = `rotate(${config.rotation}deg) translateX(${config.translateX}px) rotate(-${config.rotation}deg)`;
  }

  /**
   * This method mutates config object, be aware
   */
  updateConfigForNextFrame(config: AnimationConfig): AnimationConfig {
    config.rotation = config.rotation + this.degreePerFrame * config.speed;
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
    el.style.transition = `all linear ${this.smoothForSec}s`;
  }

  /**
   * First draw should be done without smoothing (if we don't want "appearing" effect).
   * Second animation update should be done strictly on next animationFrame
   * after applying transition property
   */
  requestAnimationFrame = (time: number, state?: AnimationState): void => {
    // Make shure first animation frame will be rendered on time
    if (state === AnimationState.initial) {
      this.runAnimationUpdate();
      requestAnimationFrame((time) =>
        this.requestAnimationFrame(time, AnimationState.second)
      );
      return;
    } else if (state === AnimationState.second) {
      this.runAnimationUpdate(true);
      this.lastAnimationFrameTs = time;
    } else if (time - this.lastAnimationFrameTs > this.calculateEachMs) {
      this.runAnimationUpdate();
      this.lastAnimationFrameTs = time;
    }

    requestAnimationFrame(this.requestAnimationFrame);
  };
}

export default TagCloudElement;
