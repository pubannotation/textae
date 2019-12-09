import GridLayout from './GridLayout'

export default class {
  constructor(editor, annotationData, renderer) {
    this._editor = editor
    this._gridLayout = new GridLayout(editor, annotationData)
    this._renderer = renderer
  }

  update(typeGap) {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._gridLayout.arrangePosition(typeGap)
    this._renderer
      .arrangeRelationPositionAllAsync()
      .then(() =>
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
      .then(() => this._renderer.arrangeRelationPositionAllAsync())
      .then(
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.end'
        )
      )
      .catch((error) => console.error(error, error.stack))
  }
}
