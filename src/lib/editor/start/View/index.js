import CursorChanger from '../../../util/CursorChanger'
import AnnotationPosition from './AnnotationPosition'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindSelectionModelEvents from './bindSelectionModelEvents'
import bindTypeGapEvents from './bindTypeGapEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import HoverRelation from './HoverRelation'
import bindMouseEvents from './bindMouseEvents'
import TextBox from './TextBox'
import GridHeight from './GridHeight'

export default class View {
  constructor(editor, annotationData, selectionModel, typeGap, typeDefinition) {
    // Place the text box behind the annotation box to allow you
    // to select the text behind the relationship label in entity editing mode.
    const html = `
    <div class="textae-editor__body">
      <div class="textae-editor__body__annotation-box"></div>
      <div class="textae-editor__body__text-box" id="${editor.editorId}_text-box"></div>
    </div>
    `
    // The editor itself has a "white-space: pre" style for processing text that contains a series of whitespace.
    // In this case, HTML line breaks are included in the editor's height calculation.
    // Remove CRLF so that it is not included in the height calculation.
    editor[0].innerHTML = html.replace(/[\n\r]+/g, '')

    this._textBox = new TextBox(
      editor[0].querySelector('.textae-editor__body__text-box'),
      annotationData
    )
    this._gridHeight = new GridHeight(annotationData, typeGap)

    const renderer = new Renderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition,
      typeGap,
      this._textBox,
      this._gridHeight
    )
    this._annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      this._textBox,
      this._gridHeight,
      renderer
    )

    bindTypeGapEvents(
      typeGap,
      editor,
      this._textBox,
      this._annotationPosition,
      this._gridHeight
    )
    bindClipBoardEvents(editor)
    bindSelectionModelEvents(editor)
    bindAnnotationDataEvents(
      editor,
      this._annotationPosition,
      this._textBox,
      this._gridHeight
    )
    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))
    bindMouseEvents(editor, new HoverRelation(editor, annotationData.entity))
  }

  updateDisplay() {
    this._textBox.forceUpdate()
    this._annotationPosition.update()
  }

  updateLineHeight() {
    this._textBox.updateLineHeight(this._gridHeight)
    this._annotationPosition.update()
  }

  getLineHeight() {
    return this._textBox.lineHeight
  }

  setLineHeight(value) {
    this._textBox.lineHeight = value
  }
}
