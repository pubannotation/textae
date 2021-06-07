import EditNumericAttributeDialog from '../../../component/EditNumericAttributeDialog'

export default function (
  selectionModelEntity,
  attrDef,
  attribute,
  commander,
  deletable,
  editTypeValues,
  pallet
) {
  new EditNumericAttributeDialog(
    attrDef,
    attribute,
    deletable,
    editTypeValues,
    pallet
  )
    .open()
    .then(({ newObj }) => {
      const command = newObj
        ? commander.factory.changeAttributesOfItemsCommand(
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
