export default class BrowserEventListener {
  #eventEmitter
  #listener

  constructor(eventEmitter, listener) {
    this.#eventEmitter = eventEmitter
    this.#listener = listener
    eventEmitter.on(
      'textae-event.annotation-data.events-observer.change',
      this.#listener
    )
  }

  dispose() {
    this.#eventEmitter.off(
      'textae-event.annotation-data.events-observer.change',
      this.#listener
    )
  }
}
