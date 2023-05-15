export default class Inspector {
  constructor(sourceElement, id, eventEmitter) {
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
