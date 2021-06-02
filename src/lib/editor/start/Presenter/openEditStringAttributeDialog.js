import EditStringAttributeDialog from '../../../component/EditStringAttributeDialog'

export default function (selectionModelEntity, attribute, commander, attrDef) {
  new EditStringAttributeDialog(attribute, attrDef)
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
