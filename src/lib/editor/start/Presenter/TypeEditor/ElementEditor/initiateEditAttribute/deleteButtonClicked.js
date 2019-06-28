import getAttributeIdByClickedButton from './getAttributeIdByClickedButton'

export default function(annotationData, selectionModel, command, e) {
  const attributeId = getAttributeIdByClickedButton(e)
  command.invoke([command.factory.attributeRemoveCommand(attributeId)], ['annotation'])

  // The event target DOM element of the attribute has already been deleted.
  // It can not be determined whether this click event occurred in the editor.
  e.stopPropagation()
}
