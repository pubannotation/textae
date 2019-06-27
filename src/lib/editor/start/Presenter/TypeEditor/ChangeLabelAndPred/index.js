import changeAttributeHandler from './changeAttributeHandler'
import EditAttributeHandler from './EditAttributeHandler'

export default function(editor, annotationData, command) {
  const editAttributeHandler = new EditAttributeHandler(annotationData)
  return (attributeId) => {
    changeAttributeHandler(editor, editAttributeHandler, command, attributeId)
  }
}
