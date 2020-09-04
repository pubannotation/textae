// Maintainance a state of which the save button is able to be push.
import Observable from 'observ'

export default class {
  constructor(editor) {
    this._observable = new Observable(false)

    // Fix loading annotation automatically when loading multitrack or broken annotation.
    // That is differnt with data on the serever.
    // So even if no changes at the editor, there is something to save to the server.
    let loadedAnnotationIsModified = false

    editor.eventEmitter.on('textae.history.change', (history) => {
      this._observable.set(
        loadedAnnotationIsModified || history.hasAnythingToSaveAnnotation
      )
    })

    editor.eventEmitter.on('textae.annotation.save', () => {
      this._observable.set(false)
      loadedAnnotationIsModified = false
    })

    editor.eventEmitter.on(
      'textae.annotationData.all.change',
      (_, multitrack, hasError) => {
        if (multitrack || hasError) {
          this._observable.set(true)
          loadedAnnotationIsModified = true
        }

        this._observable.set(false)
      }
    )
  }

  bind(callback) {
    this._observable(callback)
  }

  get hasChange() {
    return this._observable()
  }
}
