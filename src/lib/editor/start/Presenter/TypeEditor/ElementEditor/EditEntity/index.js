import SelectEnd from '../../SelectEnd'
import SelectSpan from './SelectSpan'
import EditEntityHandler from './EditEntityHandler'
import init from './init'

export default function(editor, annotationData, selectionModel, command, modeAccordingToButton, typeDefinition, spanConfig, cancelSelect) {
  const selectEnd = new SelectEnd(editor, annotationData, selectionModel, command, modeAccordingToButton, typeDefinition)
  const selectSpan = new SelectSpan(editor, annotationData, selectionModel, typeDefinition)

  const entityHandler = () => new EditEntityHandler(typeDefinition, command, annotationData, selectionModel)

  return {
    init: () => init(editor, cancelSelect, selectEnd, spanConfig, selectSpan, selectionModel),
    entityHandler: entityHandler
  }
}
