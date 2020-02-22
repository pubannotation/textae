import EditStringAttributeDialog from '../../../../component/EditStringAttributeDialog'
import getChangeOrRemoveCommand from './getChangeOrRemoveCommand'
export default function(attribute, commander, attrDef) {
  const dialog = new EditStringAttributeDialog(attribute)
  dialog.promise.then(({ newObj }) => {
    commander.invoke(getChangeOrRemoveCommand(newObj, commander, attrDef))
  })
  dialog.open()
}
