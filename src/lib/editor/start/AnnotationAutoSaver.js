import debounce from 'debounce'

export default class AnnotationAutoSaver {
  constructor(
    editor,
    buttonController,
    persistenceInterface,
    saveToParameter,
    annotationWatcher
  ) {
    this._buttonController = buttonController

    const debounceSaveAnnotation = debounce(
      () => persistenceInterface.saveAnnotation(),
      5000
    )

    annotationWatcher.bind((val) => {
      if (val && buttonController.valueOf('write-auto')) {
        debounceSaveAnnotation()
      }
    })

    editor.eventEmitter
      .on('textae-event.annotation.load', () => this._disabled())
      .on('textae-event.saveError', () => this._disabled())
      .on('textae-event.annotation.setUrl', (url) =>
        editor.eventEmitter.emit(
          'textae-event.annotation-auto-saver.enable',
          Boolean(saveToParameter || url)
        )
      )
      .on('textae-event.control.button.push', ({ buttonName, state }) => {
        // If there is something to save when the 'write-auto' button is pushed,
        // it will be saved immediately.
        if (
          buttonName === 'write-auto' &&
          state === true &&
          annotationWatcher.hasChange
        ) {
          persistenceInterface.saveAnnotation()
        }
      })
  }

  _disabled() {
    if (this._buttonController.valueOf('write-auto')) {
      this._buttonController.toggle('write-auto')
    }
  }
}
