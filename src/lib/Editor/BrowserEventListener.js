export default class BrowserEventListener {
  #target
  #event
  #listener

  constructor(target, event, listener) {
    this.#target = target
    this.#event = event
    this.#listener = listener

    this.#bind()
  }

  dispose() {
    this.#target.removeEventListener(this.#event, this.#listener)
  }

  #bind() {
    this.#target.addEventListener(this.#event, this.#listener)
  }
}
