import EditDialog from '../../../../../../../component/dialog/EditDialog'

export default function(editor, command, selectedEntities, pred, obj) {
  const done = (newPred, newObj) => {
    if (obj) {
      command.invoke([
        command.factory.attributeChangeCommand(
          selectedEntities,
          pred,
          obj,
          newPred,
          newObj
        )
      ])
    }
  }

  const dialog = new EditDialog(editor, pred, obj, done)
  dialog.open()
}
