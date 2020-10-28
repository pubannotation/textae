import GridLayout from './GridLayout'

export default class AnnotationPosition {
  constructor(editor, annotationData, textBox, gridRectangle, renderer) {
    this._editor = editor
    this._gridLayout = new GridLayout(annotationData)
    this._textBox = textBox
    this._gridRectangle = gridRectangle
    this._renderer = renderer
  }

  update() {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._gridLayout.arrangePosition(this._textBox, this._gridRectangle)

    this._renderer
      .arrangeRelationPositionAllAsync()
      .then(() =>
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.end'
        )
      )
  }
}
