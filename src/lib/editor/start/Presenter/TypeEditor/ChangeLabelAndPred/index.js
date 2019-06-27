import changeAttributeHandler from './changeAttributeHandler'

export default function(editor, annotationData, command) {
  return (attributeId) => changeAttributeHandler(editor, annotationData, command, attributeId)
}
