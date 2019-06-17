import Renderer from './Renderer'
import * as lineHeight from './lineHeight'
import Hover from './Hover'
import AnnotationPosition from './AnnotationPosition'
import CursorChanger from '../../../util/CursorChanger'
import setSelectionModelHandler from './setSelectionModelHandler'
import TypeStyle from './TypeStyle'
import RelationRenderer from './Renderer/RelationRenderer'
import updateTextBoxHeight from './updateTextBoxHeight'
import _ from 'underscore'

const BODY = `
<div class="textae-editor__body">
    <div class="textae-editor__body__annotation-box"></div>
    <div class="textae-editor__body__text-box"></div>
</div>
`

export default function(editor, annotationData, selectionModel, buttonController, typeGap, typeContainer) {
  editor[0].innerHTML = BODY
  setSelectionModelHandler(editor, annotationData, selectionModel, buttonController)

  const relationRenderer = new RelationRenderer(editor, annotationData, selectionModel, typeContainer)
  const annotationPosition = new AnnotationPosition(editor, annotationData, typeContainer, relationRenderer.arrangePositionAll)

  setHandlerOnTyapGapEvent(editor, annotationData, typeGap, typeContainer, annotationPosition)
  setHandlerOnDisplayEvent(editor, annotationPosition)

  initRenderer(
    editor,
    annotationData,
    selectionModel,
    annotationPosition.update,
    typeGap,
    typeContainer,
    buttonController.buttonStateHelper,
    relationRenderer
  )

  return {
    hoverRelation: new Hover(editor, annotationData.entity),
    updateDisplay: () => {
      updateTextBoxHeight(editor[0])
      annotationPosition.update(typeGap())
    }
  }
}

function initRenderer(editor, annotationData, selectionModel, updateAnnotationPosition, typeGap, typeContainer, buttonStateHelper, relationRenderer) {
  const renderer = new Renderer(editor, annotationData, selectionModel, buttonStateHelper, typeContainer, typeGap, relationRenderer),
    debouncedUpdateAnnotationPosition = _.debounce(() => updateAnnotationPosition(typeGap()), 100)

  renderer.init(editor, annotationData, selectionModel)
    .on('change', debouncedUpdateAnnotationPosition)
    .on('all.change', () => {
      updateTextBoxHeight(editor[0])
      lineHeight.setToTypeGap(editor[0], annotationData, typeContainer, typeGap())
      debouncedUpdateAnnotationPosition()
    })
    .on('span.add', debouncedUpdateAnnotationPosition)
    .on('span.move', debouncedUpdateAnnotationPosition)
    .on('span.remove', debouncedUpdateAnnotationPosition)
    .on('entity.add', debouncedUpdateAnnotationPosition)
    .on('entity.change', debouncedUpdateAnnotationPosition)
    .on('entity.remove', debouncedUpdateAnnotationPosition)
    .on('attribute.add', debouncedUpdateAnnotationPosition)
    .on('attribute.remove', debouncedUpdateAnnotationPosition)
    .on('relation.add', debouncedUpdateAnnotationPosition)
}

function setHandlerOnTyapGapEvent(editor, annotationData, typeGap, typeContainer, annotationPosition) {
  const setTypeStyle = (newValue) => editor.find('.textae-editor__type').css(new TypeStyle(newValue))

  typeGap(setTypeStyle)
  typeGap((newValue) => lineHeight.setToTypeGap(editor[0], annotationData, typeContainer, newValue))
  typeGap(annotationPosition.update)
}

function setHandlerOnDisplayEvent(editor, annotationPosition) {
  // Set cursor control by view rendering events.
  const cursorChanger = new CursorChanger(editor)

  annotationPosition
    .on('render.start', cursorChanger.startWait)
    .on('render.end', cursorChanger.endWait)
}
