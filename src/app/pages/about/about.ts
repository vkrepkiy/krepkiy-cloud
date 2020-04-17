import { Component, ComponentInterface } from "../../modules/core/component";
import TagCloudElement from "../../modules/tag-cloud/tag-cloud";

@Component({
  tag: "vk-about",
  template: require("./about.html"),
  style: require("./about.css"),
  elements: [TagCloudElement],
})
export class AboutElement extends HTMLElement implements ComponentInterface {}

export default AboutElement;
