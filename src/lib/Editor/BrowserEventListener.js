import diffOfAnnotation from './diffOfAnnotation'

export default class BrowserEventListener {
  #eventEmitter
  #previous
  #listener

  constructor(eventEmitter, callback, annotationModel) {
    this.#eventEmitter = eventEmitter
    this.#previous = annotationModel.externalFormat
    this.#listener = (annotationModel) => {
      // TextAE's internal data treats spans and entities separately.
      // On the other hand, in the external data, they are treated together as denotation.
      // For example, when a Span is added, an event is fired twice,
      // once for the addition of the Span and once for the addition of the Entity.
      // There is no change in denotation between these two events;
      // we want to be notified only when there is a change in denotation.
      // Notify only when there is a change by comparing with external data format.
      if (diffOfAnnotation(this.#previous, annotationModel.externalFormat)) {
        this.#previous = annotationModel.externalFormat
        callback(annotationModel.externalFormat)
      }
    }
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
