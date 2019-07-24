import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'

export default function(
  editor,
  annotationData,
  selectionModel,
  command,
  typeDefinition,
  cancelSelect
) {
  const init = () =>
    bindMouseEvents(
      editor,
      selectionModel,
      command,
      typeDefinition,
      cancelSelect
    )

  return {
    init,
    handlers: new EditRelationHandler(
      typeDefinition,
      command,
      annotationData,
      selectionModel
    )
  }
}
