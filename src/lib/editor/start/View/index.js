import Hover from './Hover'
import AnnotationPosition from './AnnotationPosition'
import setSelectionModelHandler from './setSelectionModelHandler'
import RelationRenderer from './Renderer/RelationRenderer'
import updateTextBoxHeight from './updateTextBoxHeight'
import initRenderer from './initRenderer'
import setHandlerOnTyapGapEvent from './setHandlerOnTyapGapEvent'
import setHandlerOnDisplayEvent from './setHandlerOnDisplayEvent'

const BODY = `
<div class="textae-editor__body">
    <div class="textae-editor__body__annotation-box"></div>
    <div class="textae-editor__body__text-box"></div>
</div>
`

export default function(
  editor,
  annotationData,
  selectionModel,
  buttonController,
  typeGap,
  typeDefinition
) {
  editor[0].innerHTML = BODY
  setSelectionModelHandler(
    editor,
    annotationData,
    selectionModel,
    buttonController
  )

  const relationRenderer = new RelationRenderer(
    editor,
    annotationData,
    selectionModel,
    typeDefinition
  )
  const annotationPosition = new AnnotationPosition(
    editor,
    annotationData,
    typeDefinition
  )
  annotationPosition.on('position-update.grid.end', (done) => {
    relationRenderer.arrangePositionAll()
    done()
  })

  setHandlerOnTyapGapEvent(
    editor,
    annotationData,
    typeGap,
    typeDefinition,
    annotationPosition
  )
  setHandlerOnDisplayEvent(editor, annotationPosition)

  initRenderer(
    editor,
    annotationData,
    selectionModel,
    typeGap,
    typeDefinition,
    buttonController.buttonStateHelper,
    relationRenderer,
    annotationPosition
  )

  return {
    hoverRelation: new Hover(editor, annotationData.entity),
    updateDisplay: () => {
      updateTextBoxHeight(editor[0])
      annotationPosition.update(typeGap())
    }
  }
}
