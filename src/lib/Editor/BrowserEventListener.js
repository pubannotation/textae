import filterIfModelModified from './filterIfModelModified'

export default class BrowserEventListener {
  #eventEmitter
  #previous
  #listener

  constructor(eventEmitter, callback, annotationModel) {
    this.#eventEmitter = eventEmitter
    this.#previous = annotationModel.externalFormat
    this.#listener = filterIfModelModified(annotationModel, callback)
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
