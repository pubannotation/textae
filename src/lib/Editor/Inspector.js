import diffOfAnnotation from './AnnotationDataEventsObserver/diffOfAnnotation'

export default class Inspector {
  constructor(eventEmitter, callback, annotationData) {
    this._eventEmitter = eventEmitter
    this._previousJSON = annotationData.JSON
    this._listener = (annotationData) => {
      // TextAE's internal data treats spans and entities separately.
      // On the other hand, in the external data, they are treated together as denotation.
      // For example, when a Span is added, an event is fired twice,
      // once for the addition of the Span and once for the addition of the Entity.
      // There is no change in denotation between these two events;
      // we want to be notified only when there is a change in denotation.
      // Notify only when there is a change by comparing with external data format.
      if (diffOfAnnotation(this._previousJSON, annotationData.JSON)) {
        this._previousJSON = annotationData.JSON
        callback(annotationData.JSON)
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
