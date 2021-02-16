import EditNumericAttributeDialog from '../../../component/EditNumericAttributeDialog'

export default function (selectionModelEntity, attrDef, attribute, commander) {
  new EditNumericAttributeDialog(attrDef, attribute)
    .open()
    .then(({ newObj }) => {
      const command = commander.factory.changeAttributesOfItemsWithSamePred(
        selectionModelEntity.all,
        attrDef,
        newObj
      )
      commander.invoke(command)
    })
}
