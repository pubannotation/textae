// Maintenance a state of which the save button is able to be push.
import Observable from 'observ'

import diffOfAnnotation from './diffOfAnnotation'

export default class AnnotationModelEventsObserver {
  #eventEmitter
  #originalData
  #annotationModel
  #observable = new Observable(false)

  /**
   *
   * @param {import('./UseCase/OriginalData').default} originalData
   * @param {import('./AnnotationModel').AnnotationModel} annotationModel
   */
  constructor(eventEmitter, originalData, annotationModel) {
    this.#eventEmitter = eventEmitter
    this.#originalData = originalData
    this.#annotationModel = annotationModel

    eventEmitter
      .on('textae-event.resource.annotation.save', () => {
        this.#observable.set(false)
        this.#notifyChange()
      })
      .on('textae-event.annotation-data.all.change', () => {
        this.#observable.set(false)
        this.#notifyChange()
      })
      .on('textae-event.annotation-data.span.add', () => this.#updateState())
      .on('textae-event.annotation-data.span.change', () => this.#updateState())
      .on('textae-event.annotation-data.span.remove', () => this.#updateState())
      .on('textae-event.annotation-data.entity.add', () => this.#updateState())
      .on('textae-event.annotation-data.entity.change', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.entity.remove', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.entity.move', () => this.#updateState())
      .on('textae-event.annotation-data.relation.add', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.relation.change', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.relation.remove', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.attribute.add', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.attribute.remove', () =>
        this.#updateState()
      )
      .on('textae-event.annotation-data.text.change', () => this.#updateState())

    this.#observable(() =>
      eventEmitter.emit(
        'textae-event.annotation-data.events-observer.unsaved-change',
        this.#observable()
      )
    )
  }

  get hasChange() {
    return this.#observable()
  }

  #updateState() {
    this.#observable.set(
      diffOfAnnotation(
        this.#originalData.annotation,
        this.#annotationModel.externalFormat
      )
    )
    this.#notifyChange()
  }

  #notifyChange() {
    this.#eventEmitter.emit(
      'textae-event.annotation-data.events-observer.change',
      this.#annotationModel
    )
  }
}
