import debounce from 'debounce'

export default class AnnotationAutoSaver {
  constructor(
    eventEmitter,
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

    eventEmitter
      .on('textae-event.data-access-object.annotation.load.success', () =>
        this._disabled()
      )
      .on('textae-event.data-access-object.save.error', () => this._disabled())
      .on('textae-event.data-access-object.annotation.url.set', (dataSource) =>
        eventEmitter.emit(
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
      .on('textae-event.annotation-data.events-observer.change', (val) => {
        if (val && buttonController.isPushed('write-auto')) {
          debounceSaveAnnotation()
        }
      })
  }

  _disabled() {
    if (this._buttonController.isPushed('write-auto')) {
      this._buttonController.toggleButton('write-auto')
    }
  }
}
