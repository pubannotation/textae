import EditAttributeDialog from '../../../../../../../component/EditAttributeDialog'

export default function(editor, command, selectedEntities, pred, obj) {
  const done = (newPred, newObj) => {
    if (obj) {
      command.invoke([command.factory.attributeChangeCommand(
        selectedEntities,
        pred,
        obj,
        newPred,
        newObj
      )], ['annotation'])
    }
  }

  const dialog = new EditAttributeDialog(editor, done)
  dialog.update(pred, obj)
  dialog.open()
}
