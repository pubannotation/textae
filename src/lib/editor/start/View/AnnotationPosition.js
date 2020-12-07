export default class AnnotationPosition {
  constructor(editor, annotationData, textBox, renderer) {
    this._editor = editor
    this._annotationData = annotationData
    this._textBox = textBox
    this._renderer = renderer
  }

  async update() {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    this._annotationData.span.arrangeDenotationEntityPosition()

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this._annotationData.span.arrangeBackgroundOfBlockSpanPosition(
      this._textBox
    )
    this._annotationData.span.arrangeBlockEntityPosition(this._textBox)

    this._renderer.arrangeRelationPositionAll()
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.end'
    )
  }
}
