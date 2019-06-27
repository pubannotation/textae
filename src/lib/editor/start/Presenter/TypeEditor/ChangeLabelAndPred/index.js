import changeAttributeHandler from './changeAttributeHandler'
import EditAttributeHandler from './EditAttributeHandler'

export default function(editor, annotationData, selectionModel, command, typeContainer, autocompletionWs) {
  const editAttributeHandler = new EditAttributeHandler(annotationData, selectionModel)
  return () => changeAttributeHandler(editor, selectionModel, editAttributeHandler, autocompletionWs, typeContainer, command)
}
