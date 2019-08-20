import CursorChanger from '../../../util/CursorChanger'
import Selector from '../Selector'
import Hover from './Hover'
import AnnotationPosition from './AnnotationPosition'
import bindSelectionModelEvents from './bindSelectionModelEvents'
import updateTextBoxHeight from './updateTextBoxHeight'
import bindTypeGapEvents from './bindTypeGapEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'

const BODY = `
<div class="textae-editor__body">
    <div class="textae-editor__body__annotation-box"></div>
    <div class="textae-editor__body__text-box"></div>
</div>
`

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    buttonStateHelper,
    typeGap,
    typeDefinition
  ) {
    editor[0].innerHTML = BODY

    bindSelectionModelEvents(
      selectionModel,
      new Selector(editor, annotationData),
      buttonStateHelper
    )

    const annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      typeDefinition
    )
    bindTypeGapEvents(
      typeGap,
      editor,
      annotationData,
      typeDefinition,
      annotationPosition
    )
    bindAnnotaitonPositionEvents(annotationPosition, new CursorChanger(editor))

    new Renderer(
      editor,
      annotationData,
      selectionModel,
      buttonStateHelper,
      typeDefinition,
      typeGap,
      annotationPosition
    )

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
