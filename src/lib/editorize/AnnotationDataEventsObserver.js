// Maintainance a state of which the save button is able to be push.
import Observable from 'observ'

export default class AnnotationDataEventsObserver {
  constructor(editor) {
    this._observable = new Observable(false)

    // Fix loading annotation automatically when loading multitrack or broken annotation.
    // That is differnt with data on the serever.
    // So even if no changes at the editor, there is something to save to the server.
    let loadedAnnotationIsModified = false

    editor.eventEmitter.on('textae-event.history.change', (history) => {
      this._observable.set(
        loadedAnnotationIsModified || history.hasAnythingToSaveAnnotation
      )
    })

    editor.eventEmitter.on(
      'textae-event.data-access-object.annotation.save',
      () => {
        this._observable.set(false)
        loadedAnnotationIsModified = false
      }
    )

    editor.eventEmitter.on(
      'textae-event.annotation-data.all.change',
      (_, multitrack, hasError) => {
        if (multitrack || hasError) {
          this._observable.set(true)
          loadedAnnotationIsModified = true
        }

        this._observable.set(false)
      }
    )

    this._observable(() =>
      editor.eventEmitter.emit(
        'textae-event.annotation-data.events-observer.change'
      )
    )
  }

  bind(callback) {
    this._observable(callback)
  }

  get hasChange() {
    return this._observable()
  }
}
