import GridLayout from './GridLayout'

export default class {
  constructor(editor, annotationData) {
    this._editor = editor
    this._gridLayout = new GridLayout(editor, annotationData)
  }

  update(typeGap) {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._gridLayout.arrangePosition(typeGap)
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.grid.end',
      () =>
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.end'
        )
    )
  }

  updateAsync(typeGap) {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._gridLayout
      .arrangePositionAsync(typeGap)
      .then(() =>
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.grid.end',
          () =>
            this._editor.eventEmitter.emit(
              'textae.annotationPosition.position-update.end'
            )
        )
      )
      .catch((error) => console.error(error, error.stack))
  }
}
