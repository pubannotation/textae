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
  spanConfig,
  cancelSelect
) {
  const selectEnd = new SelectEnd(
    editor,
    annotationData,
    selectionModel,
    commander,
    pushButtons,
    typeDefinition
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
    init: () =>
      init(
        editor,
        cancelSelect,
        selectEnd,
        spanConfig,
        selectSpan,
        selectionModel
      ),
    entityHandler
  }
}
