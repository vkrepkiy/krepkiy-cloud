import { Component } from "../../modules/core/component";
import { Router } from "../../modules/core/router/router";

@Component({
  tag: "vk-blog",
  template: "<h1>Blog</h1>",
  style: "",
  noEncapsulation: true,
})
export class BlogElement extends HTMLElement {
  constructor(public router: Router = new Router()) {
    super();
  }
}

export default BlogElement;
