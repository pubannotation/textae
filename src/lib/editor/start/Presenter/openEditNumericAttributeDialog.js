import EditNumericAttributeDialog from '../../../component/EditNumericAttributeDialog'

export default function (selectionModelEntity, attrDef, attribute, commander) {
  const dialog = new EditNumericAttributeDialog(attrDef, attribute)
  dialog.promise.then(({ newObj }) => {
    const command = commander.factory.changeAttributesOfItemsWithSamePred(
      selectionModelEntity.all,
      attrDef,
      newObj
    )
    commander.invoke(command)
  })
  dialog.open()
}
