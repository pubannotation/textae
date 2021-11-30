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
    selectionModelEntity.all.reduce((attrs, entity) => {
      attrs.push(entity.attributes.find((a) => a.pred == attribute.pred))
      return attrs
    }, []),
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
