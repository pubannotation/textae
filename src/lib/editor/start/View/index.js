import CursorChanger from '../../../util/CursorChanger'
import AnnotationPosition from './AnnotationPosition'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindSelectionModelEvents from './bindSelectionModelEvents'
import updateTextBoxHeight from './updateTextBoxHeight'
import bindTypeGapEvents from './bindTypeGapEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import HoverRelation from './HoverRelation'
import bindMouseEvents from './bindMouseEvents'
import setLineHeightToTypeGap from './setLineHeightToTypeGap'

export default class {
  constructor(editor, annotationData, selectionModel, typeGap, typeDefinition) {
    // The editor itself has a "white-space: pre" style for processing text that contains a series of whitespace.
    // In this case, HTML line breaks are included in the editor's height calculation.
    // Remove CRLF so that it is not included in the height calculation.
    editor[0].innerHTML = `
    <div class="textae-editor__body">
      <div class="textae-editor__body__text-box" id="${editor.editorId}_text-box"></div>
      <div class="textae-editor__body__annotation-box"></div>
    </div>
    `.replace(/[\n\r]+/g, '')

    bindClipBoardEvents(editor)
    bindSelectionModelEvents(editor, annotationData)

    const renderer = new Renderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition,
      typeGap
    )
    const annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      renderer
    )
    bindTypeGapEvents(typeGap, editor, annotationData, annotationPosition)
    bindAnnotationDataEvents(editor, annotationPosition, typeGap)
    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))
    bindMouseEvents(editor, new HoverRelation(editor, annotationData.entity))

    this._editor = editor
    this._annotationData = annotationData
    this._typeGap = typeGap
    this._annotationPosition = annotationPosition
  }

  updateDisplay() {
    updateTextBoxHeight(this._editor[0])
    this._annotationPosition.update(this._typeGap())
  }

  updateLineHeight() {
    setLineHeightToTypeGap(
      this._editor[0],
      this._annotationData,
      this._typeGap()
    )
    this._annotationPosition.update(this._typeGap())
  }
}
