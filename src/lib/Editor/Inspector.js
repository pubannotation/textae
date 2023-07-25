export default class Inspector {
  constructor(eventEmitter, callback) {
    eventEmitter.on(
      'textae-event.annotation-data.events-observer.change',
      (annotationData) => callback(annotationData.JSON)
    )
  }
}
