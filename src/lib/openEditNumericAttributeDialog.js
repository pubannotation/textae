import EditNumericAttributeDialog from './component/EditNumericAttributeDialog'

export default function (
  selectionModelEntity,
  attrDef,
  attribute,
  commander,
  editTypeValues,
  pallet
) {
  new EditNumericAttributeDialog(
    attrDef,
    attribute,
    true,
    editTypeValues,
    pallet
  )
    .open()
    .then(({ newObj }) => {
      const command = newObj
        ? commander.factory.changeAttributeObjOfItemsCommand(
            selectionModelEntity.all,
            attrDef,
            newObj
          )
        : commander.factory.removeAttributesFromItemsByPredCommand(
            selectionModelEntity.all,
            attrDef
          )

      commander.invoke(command)
    })
}
