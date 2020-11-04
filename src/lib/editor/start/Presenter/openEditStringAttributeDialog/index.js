import EditStringAttributeDialog from '../../../../component/EditStringAttributeDialog'
import getChangeOrRemoveCommand from './getChangeOrRemoveCommand'
export default function (attribute, commander, attrDef) {
  const dialog = new EditStringAttributeDialog(attribute, attrDef)
  dialog.promise.then(({ newObj, newLabel }) => {
    commander.invoke(
      getChangeOrRemoveCommand(newObj, commander, attrDef, newLabel)
    )
  })
  dialog.open()
}
