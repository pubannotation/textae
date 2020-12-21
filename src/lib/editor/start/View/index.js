import CursorChanger from '../../../util/CursorChanger'
import AnnotationPosition from './AnnotationPosition'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import HoverRelation from './HoverRelation'
import bindMouseEvents from './bindMouseEvents'

export default class View {
  constructor(editor, annotationData, selectionModel) {
    const renderer = new Renderer(
      editor,
      annotationData,
      selectionModel,
      annotationData.typeDefinition
    )
    this._annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      renderer
    )
    this._annotationData = annotationData

    annotationData.entityGap.bind(() => this._applyEntityGap())
    bindClipBoardEvents(editor)
    bindAnnotationDataEvents(
      editor,
      this._annotationPosition,
      this._annotationData.textBox
    )
    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))
    bindMouseEvents(editor, new HoverRelation(editor, annotationData.entity))
  }

  updateDisplay() {
    this._annotationData.textBox.forceUpdate()
    this._annotationPosition.update()
  }

  updateLineHeight() {
    this._annotationData.textBox.updateLineHeight()
    this._annotationPosition.update()
  }

  _applyEntityGap() {
    for (const entity of this._annotationData.entity.denotations) {
      entity.reflectEntityGapInTheHeight()
    }
    this.updateLineHeight()
  }
}
