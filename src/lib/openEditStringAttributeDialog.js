import EditStringAttributeDialog from './component/EditStringAttributeDialog'

export default function (
  selectionModelEntity,
  attribute,
  commander,
  attrDef,
  editTypeValues,
  pallet
) {
  new EditStringAttributeDialog(
    attribute,
    attrDef,
    true,
    editTypeValues,
    pallet
  )
    .open()
    .then(({ newObj, newLabel }) => {
      if (newObj) {
        commander.invoke(
          commander.factory.changeStringAttributeObjOfItemsCommand(
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
