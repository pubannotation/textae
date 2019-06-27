import getAttributeIdByClickedButton from './getAttributeIdByClickedButton'

export default function(annotationData, selectionModel, command, e) {
  const attributeId = getAttributeIdByClickedButton(e)

  command.invoke([command.factory.attributeRemoveCommand(attributeId)], ['annotation'])
  selectionModel.attribute.remove(attributeId)
}
