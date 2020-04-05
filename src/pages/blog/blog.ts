import { Component } from "../../modules/utils/component";
import { Router } from "../../modules/utils/router";

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
