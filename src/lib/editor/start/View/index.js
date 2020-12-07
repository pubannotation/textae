import CursorChanger from '../../../util/CursorChanger'
import AnnotationPosition from './AnnotationPosition'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import HoverRelation from './HoverRelation'
import bindMouseEvents from './bindMouseEvents'

export default class View {
  constructor(
    editor,
    annotationData,
    selectionModel,
    entityGap,
    typeDefinition,
    textBox
  ) {
    this._textBox = textBox
    this._gridRectangle = annotationData.gridRectangle
    const renderer = new Renderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition,
      entityGap,
      this._textBox
    )
    this._annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      this._textBox,
      renderer
    )
    this._annotationData = annotationData

    entityGap.bind((value) => this._apllyEntityGap(value))
    bindClipBoardEvents(editor)
    bindAnnotationDataEvents(
      editor,
      this._annotationPosition,
      this._textBox,
      annotationData
    )
    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))
    bindMouseEvents(editor, new HoverRelation(editor, annotationData.entity))
  }

  updateDisplay() {
    this._textBox.forceUpdate()
    this._annotationPosition.update()
  }

  updateLineHeight() {
    this._textBox.updateLineHeight()
    this._annotationPosition.update()
  }

  getLineHeight() {
    return this._textBox.lineHeight
  }

  setLineHeight(value) {
    this._textBox.lineHeight = value
  }

  _apllyEntityGap(value) {
    for (const entity of this._annotationData.entity.denotations) {
      entity.reflectEntityGapInTheHeight(value)
    }
    this._textBox.updateLineHeight()
    this._annotationPosition.update()
  }
}
