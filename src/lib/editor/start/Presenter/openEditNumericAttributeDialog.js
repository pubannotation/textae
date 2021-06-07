import EditNumericAttributeDialog from '../../../component/EditNumericAttributeDialog'

export default function (
  selectionModelEntity,
  attrDef,
  attribute,
  commander,
  deletable,
  pallet
) {
  new EditNumericAttributeDialog(attrDef, attribute, deletable, pallet)
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
