import CursorChanger from '../../../util/CursorChanger'
import Modifier from './Modifier'
import Hover from './Hover'
import AnnotationPosition from './AnnotationPosition'
import bindSelectionModelEvents from './bindSelectionModelEvents'
import updateTextBoxHeight from './updateTextBoxHeight'
import bindTypeGapEvents from './bindTypeGapEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationPositionOnAnnotationDataEvents from './bindAnnotationPositionOnAnnotationDataEvents'

const BODY = `
<div class="textae-editor__body">
    <div class="textae-editor__body__annotation-box"></div>
    <div class="textae-editor__body__text-box"></div>
</div>
`

export default class {
  constructor(editor, annotationData, selectionModel, typeGap, typeDefinition) {
    // The editor itself has a "white-space: pre" style for processing text that contains a series of whitespace.
    // In this case, HTML line breaks are included in the editor's height calculation.
    // Remove CRLF so that it is not included in the height calculation.
    editor[0].innerHTML = BODY.replace(/[\n\r]+/g, '')

    bindSelectionModelEvents(editor, new Modifier(editor, annotationData))

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
    bindAnnotationPositionOnAnnotationDataEvents(
      editor,
      annotationPosition,
      typeGap
    )
    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))

    this._hoverRelation = new Hover(editor, annotationData.entity)
    this._editor = editor
    this._typeGap = typeGap
    this._annotationPosition = annotationPosition
  }

  get hoverRelation() {
    return this._hoverRelation
  }

  updateDisplay() {
    updateTextBoxHeight(this._editor[0])
    this._annotationPosition.update(this._typeGap())
  }
}
