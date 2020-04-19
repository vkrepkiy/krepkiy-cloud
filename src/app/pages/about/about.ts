import { Component, ComponentInterface } from "../../modules/core/component";
import TagCloudElement from "../../modules/skill-whirl/skill-whirl";

@Component({
  tag: "vk-about",
  template: require("./about.html"),
  style: require("./about.css"),
  elements: [TagCloudElement],
})
export class AboutElement extends HTMLElement implements ComponentInterface {}

export default AboutElement;
