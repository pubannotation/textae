import Hover from './Hover'
import AnnotationPosition from './AnnotationPosition'
import setSelectionModelHandler from './setSelectionModelHandler'
import RelationRenderer from './Renderer/RelationRenderer'
import updateTextBoxHeight from './updateTextBoxHeight'
import setHandlerOnTyapGapEvent from './setHandlerOnTyapGapEvent'
import setHandlerOnDisplayEvent from './setHandlerOnDisplayEvent'
import Renderer from './Renderer'
import Selector from '../Selector'

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
    buttonController,
    typeGap,
    typeDefinition
  ) {
    this._editor = editor
    this._typeGap = typeGap

    editor[0].innerHTML = BODY

    const selector = new Selector(editor, annotationData)
    setSelectionModelHandler(
      selectionModel,
      selector,
      buttonController.buttonStateHelper
    )

    const relationRenderer = new RelationRenderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition
    )

    this._annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      typeDefinition
    )
    this._annotationPosition.on('position-update.grid.end', (done) => {
      relationRenderer.arrangePositionAll()
      done()
    })

    setHandlerOnTyapGapEvent(
      editor,
      annotationData,
      typeGap,
      typeDefinition,
      this._annotationPosition
    )
    setHandlerOnDisplayEvent(editor, this._annotationPosition)

    new Renderer(
      editor,
      annotationData,
      selectionModel,
      buttonController.buttonStateHelper,
      typeDefinition,
      typeGap,
      relationRenderer,
      this._annotationPosition
    )

    this._hoverRelation = new Hover(editor, annotationData.entity)
  }

  get hoverRelation() {
    return this._hoverRelation
  }

  updateDisplay() {
    updateTextBoxHeight(this._editor[0])
    this._annotationPosition.update(this._typeGap())
  }
}
