export default class AnnotationPosition {
  constructor(editor, annotationData, renderer) {
    this._editor = editor
    this._annotationData = annotationData
    this._renderer = renderer
  }

  update() {
    this._editor.eventEmitter.emit(
      'textae-event.annotation-position.position-update.start'
    )

    this._annotationData.span.arrangeDenotationEntityPosition()

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this._annotationData.span.arrangeBackgroundOfBlockSpanPosition()
    this._annotationData.span.arrangeBlockEntityPosition()

    this._renderer.arrangeRelationPositionAll()
    this._editor.eventEmitter.emit(
      'textae-event.annotation-position.position-update.end'
    )
  }
}
