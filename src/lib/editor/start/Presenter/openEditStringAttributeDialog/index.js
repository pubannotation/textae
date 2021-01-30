import EditStringAttributeDialog from '../../../../component/EditStringAttributeDialog'
import getChangeOrRemoveCommand from './getChangeOrRemoveCommand'

export default function (selectionModelEntity, attribute, commander, attrDef) {
  const dialog = new EditStringAttributeDialog(attribute, attrDef)
  dialog.promise.then(({ newObj, newLabel }) => {
    const command = getChangeOrRemoveCommand(
      newObj,
      commander,
      attrDef,
      newLabel
    )

    commander.invoke(command)
  })
  dialog.open()
}
