export default class EditorEventListener {
  #eventEmitter
  #event
  #listener

  constructor(eventEmitter, event, listener) {
    this.#eventEmitter = eventEmitter
    this.#event = event
    this.#listener = listener

    eventEmitter.on(event, this.#listener)
  }

  dispose() {
    this.#eventEmitter.off(this.#event, this.#listener)
  }
}
