import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'

export default function(editor, annotationData, selectionModel, command, typeContainer, cancelSelect) {
  const init = () => bindMouseEvents(editor, selectionModel, command, typeContainer, cancelSelect)

  return {
    init,
    handlers: new EditRelationHandler(typeContainer, command, annotationData, selectionModel)
  }
}
