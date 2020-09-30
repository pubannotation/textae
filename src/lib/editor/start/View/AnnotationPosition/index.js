import GridLayout from './GridLayout'

export default class {
  constructor(editor, annotationData, renderer, gridHeight) {
    this._editor = editor
    this._gridLayout = new GridLayout(editor, annotationData, gridHeight)
    this._renderer = renderer
  }

  update() {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._gridLayout.arrangePosition()
    this._renderer
      .arrangeRelationPositionAllAsync()
      .then(() =>
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.end'
        )
      )
  }
}
