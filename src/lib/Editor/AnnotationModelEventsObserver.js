// Maintenance a state of which the save button is able to be push.
import Observable from 'observ'
import diffOfAnnotation from './diffOfAnnotation'

export default class AnnotationModelEventsObserver {
  /**
   *
   * @param {import('./InternalAPI/OriginalData').default} originalData
   * @param {import('./AnnotationModel').AnnotationModel} annotationModel
   */
  constructor(eventEmitter, originalData, annotationModel) {
    this._eventEmitter = eventEmitter
    this._originalData = originalData
    this._annotationModel = annotationModel
    this._observable = new Observable(false)

    eventEmitter
      .on('textae-event.resource.annotation.save', () => {
        this._observable.set(false)
        this._loadedAnnotationIsModified = false
        this._notifyChange()
      })
      .on('textae-event.annotation-data.all.change', () => {
        this._observable.set(false)
        this._notifyChange()
      })
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
        'textae-event.annotation-data.events-observer.unsaved-change',
        this._observable()
      )
    )
  }

  get hasChange() {
    return this._observable()
  }

  _updateState() {
    this._observable.set(
      diffOfAnnotation(
        this._originalData.annotation,
        this._annotationModel.externalFormat
      )
    )
    this._notifyChange()
  }

  _notifyChange() {
    this._eventEmitter.emit(
      'textae-event.annotation-data.events-observer.change',
      this._annotationModel
    )
  }
}
