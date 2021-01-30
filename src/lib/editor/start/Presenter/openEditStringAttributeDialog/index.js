import EditStringAttributeDialog from '../../../../component/EditStringAttributeDialog'

export default function (selectionModelEntity, attribute, commander, attrDef) {
  const dialog = new EditStringAttributeDialog(attribute, attrDef)
  dialog.promise.then(({ newObj, newLabel }) => {
    let command
    if (newObj) {
      command = commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
        attrDef,
        newObj,
        newLabel
      )
    } else {
      command = commander.factory.removeAttributesFromSelectedEntitiesByPredCommand(
        attrDef
      )
    }

    commander.invoke(command)
  })
  dialog.open()
}
