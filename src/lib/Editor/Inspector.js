import diffOfAnnotation from './diffOfAnnotation'

export default class Inspector {
  constructor(eventEmitter, callback, annotationModel) {
    this._eventEmitter = eventEmitter
    this._previous = annotationModel.externalFormat
    this._listener = (annotationModel) => {
      // TextAE's internal data treats spans and entities separately.
      // On the other hand, in the external data, they are treated together as denotation.
      // For example, when a Span is added, an event is fired twice,
      // once for the addition of the Span and once for the addition of the Entity.
      // There is no change in denotation between these two events;
      // we want to be notified only when there is a change in denotation.
      // Notify only when there is a change by comparing with external data format.
      if (diffOfAnnotation(this._previous, annotationModel.externalFormat)) {
        this._previous = annotationModel.externalFormat
        callback(annotationModel.externalFormat)
      }
    }
    eventEmitter.on(
      'textae-event.annotation-data.events-observer.change',
      this._listener
    )
  }

  die() {
    this._eventEmitter.off(
      'textae-event.annotation-data.events-observer.change',
      this._listener
    )
  }
}
