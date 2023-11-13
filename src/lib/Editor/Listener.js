export default class Listener {
  #target
  #event
  #listener

  constructor(target, event, listener) {
    this.#target = target
    this.#event = event
    this.#listener = listener
  }

  bind() {
    this.#target.addEventListener(this.#event, this.#listener)
  }

  dispose() {
    this.#target.removeEventListener(this.#event, this.#listener)
  }
}
