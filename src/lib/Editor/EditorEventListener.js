export default class EditorEventListener {
  #eventEmitter
  #events
  #listener

  constructor(eventEmitter, events, listener) {
    this.#eventEmitter = eventEmitter
    this.#events = events
    this.#listener = listener

    for (const e of events) {
      eventEmitter.on(e, this.#listener)
    }
  }

  dispose() {
    for (const e of this.#events) {
      this.#eventEmitter.off(e, this.#listener)
    }
  }
}
