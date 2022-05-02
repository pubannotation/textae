import dohtml from 'dohtml'

export default class Inspector {
  constructor(sourceElement, id, eventEmitter) {
    const destinationElement = dohtml.create(
      `<div id="${id}" style="display: none;"></div>`
    )
    sourceElement.insertAdjacentElement('afterend', destinationElement)

    eventEmitter.on(
      'textae-event.annotation-data.events-observer.change',
      (annotationData) => {
        console.log(annotationData)
        destinationElement.textContent = JSON.stringify(
          annotationData.JSON,
          null,
          2
        )
      }
    )
  }
}
