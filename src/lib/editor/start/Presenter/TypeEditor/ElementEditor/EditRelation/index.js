import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  typeDefinition
) {
  const init = () =>
    bindMouseEvents(editor, selectionModel, commander, typeDefinition)

  return {
    init,
    handlers: new EditRelationHandler(
      typeDefinition,
      commander,
      annotationData,
      selectionModel
    )
  }
}
