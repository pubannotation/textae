import GridLayout from './GridLayout'

export default class AnnotationPosition {
  constructor(editor, annotationData, gridHeight, renderer) {
    this._editor = editor
    this._gridLayout = new GridLayout(annotationData)
    this._gridHeight = gridHeight
    this._renderer = renderer
  }

  update() {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._gridLayout.arrangePosition(this._gridHeight)

    this._renderer
      .arrangeRelationPositionAllAsync()
      .then(() =>
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.end'
        )
      )
  }
}
