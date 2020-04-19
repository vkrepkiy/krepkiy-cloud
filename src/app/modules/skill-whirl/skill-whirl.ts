import { Component, ComponentInterface } from "../core/component";

interface AnimationConfig {
  fontSizeEm: number;
  secForRound: number;
  rotationOffset: number;
  translateX: number;
}

@Component({
  tag: "vk-skill-whirl",
  template: require("./skill-whirl.html"),
  style: require("./skill-whirl.css"),
  elements: [],
})
export class TagCloudElement extends HTMLElement implements ComponentInterface {
  // Should be sorted by length
  // TODO: use this input to display values
  public set skills(skillsConfig) {
    this.#items = skillsConfig;
  }
  public get skills() {
    return this.#items;
  }

  #items: string[] = [
    "Ag-grid",
    "Angular 2+",
    "Big data",
    "C#",
    "CoffeeScript",
    "CI/CD",
    "CSS 3",
    "Cypress",
    "docker-compose",
    "Docker",
    "E2E testing",
    "ESnext",
    "Git",
    "Grunt",
    "HighLoad",
    "HTML 5",
    "Jasmine",
    "JavaScript",
    "Jest",
    "jQuery",
    "Leaflet",
    "Lerna",
    "lodash",
    "NodeJS",
    "NPM",
    "OpenAPI",
    "PostgreSQL",
    "PWA",
    "RxJS",
    "SPA",
    "SaaS",
    "Swagger",
    "SASS",
    "TypeScript",
    "Unit testing",
    "Webpack",
    "XML",
    "XSLT",
    "Yarn",
  ].sort((a, b) => a.length - b.length);

  #itemWrapperSelector = ".container";
  #itemSelector = ".item";
  #itemLinkSelector = ".itemLink";
  #itemTplSelector = "#skillItem";
  #titleSelector = ".title";

  public fontSizeMinEm = 0.7;
  public fontSizeMultiplier = 1.5;
  public secForRoundBase = 50;
  public secForRoundMultiplier = 0.5;

  private containerMinSize: number;
  private titleSize: number;

  componentConnected() {
    const titleEL = this.shadowRoot!.querySelector(
      this.#titleSelector
    ) as HTMLElement;
    this.titleSize = Math.max(titleEL?.clientHeight, titleEL.clientWidth);
    this.updateItems();

    // Init props
    this.containerMinSize = Math.min(this.offsetHeight, this.offsetWidth);
    // Setup logic
    this.updateStyleSheet(this.getConfigs(this.getItems()));
  }

  updateItems(): void {
    const wrapper = this.shadowRoot!.querySelector(
      this.#itemWrapperSelector
    ) as HTMLElement;
    const tpl = this.shadowRoot!.querySelector(
      this.#itemTplSelector
    ) as HTMLTemplateElement;

    for (let i = 0; i < this.#items.length; i++) {
      const tplClone = tpl.content.cloneNode(true) as DocumentFragment;
      tplClone.querySelector(this.#itemLinkSelector)!.textContent = this.#items[
        i
      ];
      wrapper.appendChild(tplClone);
    }
  }

  getItems(): HTMLElement[] {
    return Array.from(this.shadowRoot!.querySelectorAll(this.#itemSelector));
  }

  updateStyleSheet(configs: AnimationConfig[]): void {
    const styleSheet = this.shadowRoot!.styleSheets[0] as CSSStyleSheet;

    for (let i = 0; i < configs.length; i++) {
      let config = configs[i];

      styleSheet.insertRule(`${this.#itemSelector}:nth-child(${i + 1}) {
        font-size: ${config.fontSizeEm}em;
        animation: rotate_${i} ${
        config.secForRound
      }s infinite linear, appear_${i} ${config.rotationOffset}ms 1 forwards;
        animation-delay: ${config.rotationOffset}ms;
      }`);

      styleSheet.insertRule(`@keyframes appear_${i + 1} {
        0% {
          opacity: 0
        }
        100% {
          opacity: 1
        }
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
  getConfigs(items: any[]): AnimationConfig[] {
    return items.map((_el, i) => this.getRandomConfig(items.length, i));
  }

  getRandomConfig(total: number, i: number): AnimationConfig {
    // Generate config based on index to total ratio
    const randomSeed = i / total;
    return {
      fontSizeEm: Math.max(
        this.fontSizeMinEm,
        randomSeed * this.fontSizeMultiplier
      ),
      secForRound: (1 - 1 * this.secForRoundMultiplier) * this.secForRoundBase,
      rotationOffset: Math.floor(randomSeed * 360) * 3,
      translateX: Math.round(
        Math.max(
          this.titleSize,
          Math.round(randomSeed * (this.containerMinSize / 2))
        )
      ),
    };
  }
}

export default TagCloudElement;
