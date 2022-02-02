// Maintainance a state of which the save button is able to be push.
import Observable from 'observ'
import diffOfAnnotation from './diffOfAnnotation'

export default class AnnotationDataEventsObserver {
  constructor(eventEmitter, originalData, annotationData) {
    this._originalData = originalData
    this._annotationData = annotationData
    this._observable = new Observable(false)

    // Fix loading annotation automatically when loading multitrack or broken annotation.
    // That is differnt with data on the serever.
    // So even if no changes at the editor, there is something to save to the server.
    this._loadedAnnotationIsModified = false

    eventEmitter
      .on('textae-event.data-access-object.annotation.save', () => {
        this._observable.set(false)
        this._loadedAnnotationIsModified = false
      })
      .on(
        'textae-event.annotation-data.all.change',
        (_, multitrack, hasError) => {
          if (multitrack || hasError) {
            this._observable.set(true)
            this._loadedAnnotationIsModified = true
          } else {
            this._observable.set(false)
            this._loadedAnnotationIsModified = false
          }
        }
      )
      .on('textae-event.annotation-data.span.add', () => this._updateState())
      .on('textae-event.annotation-data.span.change', () => this._updateState())
      .on('textae-event.annotation-data.span.remove', () => this._updateState())
      .on('textae-event.annotation-data.entity.add', () => this._updateState())
      .on('textae-event.annotation-data.entity.change', () =>
        this._updateState()
      )
      .on('textae-event.annotation-data.entity.remove', () =>
        this._updateState()
      )
      .on('textae-event.annotation-data.entity.move', () => this._updateState())
      .on('textae-event.annotation-data.relation.add', () =>
        this._updateState()
      )
      .on('textae-event.annotation-data.relation.change', () =>
        this._updateState()
      )
      .on('textae-event.annotation-data.relation.remove', () =>
        this._updateState()
      )
      .on('textae-event.annotation-data.attribute.add', () =>
        this._updateState()
      )
      .on('textae-event.annotation-data.attribute.remove', () =>
        this._updateState()
      )

    this._observable(() =>
      eventEmitter.emit(
        'textae-event.annotation-data.events-observer.change',
        this._observable()
      )
    )
  }

  get hasChange() {
    return this._observable()
  }

  _updateState() {
    this._observable.set(
      this._loadedAnnotationIsModified ||
        diffOfAnnotation(this._originalData, this._annotationData)
    )
  }
}
