import EditAttributeDialog from '../../../../../component/EditAttributeDialog'

export default function(editor, editAttributeHandler, command, attributeId) {
  const value1 = editAttributeHandler.getSelectedPred(attributeId)
  const value2 = editAttributeHandler.getSelectedValue(attributeId)

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
