import SelectEnd from '../../SelectEnd'
import SelectSpan from './SelectSpan'
import EditEntityHandler from './EditEntityHandler'
import init from './init'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  pushButtons,
  typeDefinition,
  spanConfig
) {
  const selectEnd = new SelectEnd(
    editor,
    annotationData,
    selectionModel,
    commander,
    pushButtons
  )
  const selectSpan = new SelectSpan(annotationData, selectionModel)

  const entityHandler = () =>
    new EditEntityHandler(
      typeDefinition,
      commander,
      annotationData,
      selectionModel
    )

  return {
    init: () => init(editor, selectEnd, spanConfig, selectSpan, selectionModel),
    entityHandler
  }
}
