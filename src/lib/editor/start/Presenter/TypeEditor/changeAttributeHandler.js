import EditAttributeDialog from '../../../../component/EditAttributeDialog'

export default function(editor, annotationData, command, attributeId) {
  const attribute = annotationData.attribute.get(attributeId)
  const predicate = attribute.pred
  const value = attribute.value

  const done = (predicate, value) => {
    if (value) {
      command.invoke([command.factory.attributeChangeCommand(
        attributeId,
        predicate,
        value
      )], ['annotation'])
    }
  }

  const dialog = new EditAttributeDialog(editor, done)
  dialog.update(predicate, value)
  dialog.open()
}
