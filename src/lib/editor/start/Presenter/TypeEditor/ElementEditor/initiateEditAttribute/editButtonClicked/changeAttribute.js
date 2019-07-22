import EditAttributeDialog from '../../../../../../../component/EditAttributeDialog'

export default function(editor, annotationData, command, attributeId) {
  const attribute = annotationData.attribute.get(attributeId)
  const predicate = attribute.pred
  const obj = attribute.obj

  const done = (pred, obj) => {
    if (obj) {
      command.invoke([command.factory.attributeChangeCommand(
        attributeId,
        pred,
        obj
      )], ['annotation'])
    }
  }

  const dialog = new EditAttributeDialog(editor, done)
  dialog.update(predicate, obj)
  dialog.open()
}
