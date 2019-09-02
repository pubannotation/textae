import EditDialog from '../../../../../../../component/dialog/EditDialog'

export default function(editor, commander, selectedEntities, pred, obj) {
  const done = (newPred, newObj) => {
    if (obj) {
      commander.invoke(
        commander.factory.attributeChangeCommand(
          selectedEntities,
          pred,
          obj,
          newPred,
          newObj
        )
      )
    }
  }

  const dialog = new EditDialog(editor, pred, obj, done)
  dialog.open()
}
