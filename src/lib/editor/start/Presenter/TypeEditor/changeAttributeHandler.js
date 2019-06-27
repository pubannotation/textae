import EditAttributeDialog from '../../../../component/EditAttributeDialog'

export default function(editor, annotationData, command, attributeId) {
  const attribute = annotationData.attribute.get(attributeId)
  const value1 = attribute.pred
  const value2 = attribute.value

  const done = (pred, value) => {
    if (value) {
      command.invoke([command.factory.attributeChangeCommand(
        attributeId,
        pred,
        value
      )], ['annotation'])
    }
  }

  const dialog = new EditAttributeDialog(editor, done)
  dialog.update(value1, value2)
  dialog.open()
}
