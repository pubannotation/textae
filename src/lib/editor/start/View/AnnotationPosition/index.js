import arrangeDenotionEntityPosition from './arrangeDenotionEntityPosition'
import arrangeBackgroundOfBlockSpanPosition from './arrangeBackgroundOfBlockSpanPosition'

export default class AnnotationPosition {
  constructor(editor, annotationData, textBox, gridRectangle, renderer) {
    this._editor = editor
    this._annotationData = annotationData
    this._textBox = textBox
    this._gridRectangle = gridRectangle
    this._renderer = renderer
  }

  update() {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    arrangeDenotionEntityPosition(this._annotationData, this._gridRectangle)
    arrangeBackgroundOfBlockSpanPosition(this._annotationData, this._textBox)

    this._renderer
      .arrangeRelationPositionAllAsync()
      .then(() =>
        this._editor.eventEmitter.emit(
          'textae.annotationPosition.position-update.end'
        )
      )
  }
}
