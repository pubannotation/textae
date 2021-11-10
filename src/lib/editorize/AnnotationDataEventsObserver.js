// Maintainance a state of which the save button is able to be push.
import Observable from 'observ'

export default class AnnotationDataEventsObserver {
  constructor(eventEmitter, history) {
    this._history = history
    this._observable = new Observable(false)

    // Fix loading annotation automatically when loading multitrack or broken annotation.
    // That is differnt with data on the serever.
    // So even if no changes at the editor, there is something to save to the server.
    this._loadedAnnotationIsModified = false

    const updateState = () => {
      this._observable.set(
        this._loadedAnnotationIsModified ||
          this._history.hasAnythingToSaveAnnotation
      )
    }
    eventEmitter.on('textae-event.history.change', updateState)

    eventEmitter.on('textae-event.data-access-object.annotation.save', () => {
      this._observable.set(false)
      this._loadedAnnotationIsModified = false
    })

    eventEmitter.on(
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
}
