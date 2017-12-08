import getAttributeIdByClickedButton from './getAttributeIdByClickedButton'

export default function(annotationData, selectionModel, command, e) {
  let attributeId = getAttributeIdByClickedButton(e),
    attribute = annotationData.attribute.get(attributeId)

  command.invoke([command.factory.attributeRemoveCommand(attributeId)], ['annotation'])
  selectionModel.attribute.remove(attributeId)
}
