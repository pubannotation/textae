import EditNumericAttributeDialog from '../../../component/EditNumericAttributeDialog'

export default function (
  selectionModelEntity,
  attrDef,
  attribute,
  commander,
  deletable
) {
  new EditNumericAttributeDialog(attrDef, attribute, deletable)
    .open()
    .then(({ newObj }) => {
      const command = newObj
        ? commander.factory.changeAttributesOfItemsWithSamePred(
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
