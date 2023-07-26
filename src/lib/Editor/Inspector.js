export default class Inspector {
  constructor(eventEmitter, callback) {
    this._eventEmitter = eventEmitter
    this._listener = (annotationData) => callback(annotationData.JSON)

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
