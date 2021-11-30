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
    attrDef,
    attribute,
    selectionModelEntity.all.reduce((attrs, entity) => {
      attrs.push(entity.attributes.find((a) => a.pred == attribute.pred))
      return attrs
    }, []),
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
