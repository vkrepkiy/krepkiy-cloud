class CustomElementsMock {
  registry = new Map();

  define(tag, item) {
    this.registry.set(tag, item);
  }

  get(tag) {
    return this.registry.get(tag);
  }
}

Object.defineProperty(window, "customElements", {
  value: new CustomElementsMock(),
});
