import debounce from 'debounce'

export default class AnnotationAutoSaver {
  constructor(
    editor,
    buttonController,
    persistenceInterface,
    saveToParameter,
    annotationDataEventsObserver
  ) {
    this._buttonController = buttonController

    const debounceSaveAnnotation = debounce(
      () => persistenceInterface.saveAnnotation(),
      5000
    )

    annotationDataEventsObserver.bind((val) => {
      if (val && buttonController.isPushed('write-auto')) {
        debounceSaveAnnotation()
      }
    })

    editor.eventEmitter
      .on('textae-event.data-access-object.annotation.load.success', () =>
        this._disabled()
      )
      .on('textae-event.data-access-object.save.error', () => this._disabled())
      .on('textae-event.data-access-object.annotation.url.set', (dataSource) =>
        editor.eventEmitter.emit(
          'textae-event.annotation-auto-saver.enable',
          Boolean(saveToParameter || dataSource.id)
        )
      )
      .on('textae-event.control.button.push', ({ name, isPushed }) => {
        // If there is something to save when the 'write-auto' button is pushed,
        // it will be saved immediately.
        if (
          name === 'write-auto' &&
          isPushed === true &&
          annotationDataEventsObserver.hasChange
        ) {
          persistenceInterface.saveAnnotation()
        }
      })
  }

  _disabled() {
    if (this._buttonController.isPushed('write-auto')) {
      this._buttonController.toggleButton('write-auto')
    }
  }
}
