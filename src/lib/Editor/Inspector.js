export default class Inspector {
  constructor(eventEmitter, id) {
    eventEmitter.on(
      'textae-event.annotation-data.events-observer.change',
      (annotationData) => {
        const destinationElement = document.querySelector(`#${id}`)
        if (destinationElement) {
          destinationElement.textContent = JSON.stringify(
            annotationData.JSON,
            null,
            2
          )
        }
      }
    )
  }
}
