import EditStringAttributeDialog from '../../../component/EditStringAttributeDialog'

export default function (selectionModelEntity, attribute, commander, attrDef) {
  const dialog = new EditStringAttributeDialog(attribute, attrDef)

  dialog.promise.then(({ newObj, newLabel }) => {
    if (newObj) {
      commander.invoke(
        commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
          attrDef,
          newObj,
          newLabel
        )
      )
    } else {
      commander.invoke(
        commander.factory.removeAttributesFromItemsByPredCommand(
          selectionModelEntity.all,
          attrDef
        )
      )
    }
  })

  dialog.open()
}
