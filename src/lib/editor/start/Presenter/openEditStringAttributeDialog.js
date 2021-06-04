import EditStringAttributeDialog from '../../../component/EditStringAttributeDialog'

export default function (
  selectionModelEntity,
  attribute,
  commander,
  attrDef,
  pallet
) {
  new EditStringAttributeDialog(attribute, attrDef, pallet)
    .open()
    .then(({ newObj, newLabel }) => {
      if (newObj) {
        commander.invoke(
          commander.factory.changeAttributesOfItemsCommand(
            selectionModelEntity.all,
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
}
