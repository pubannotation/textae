import openEditStringAttributeDialog from '../../openEditStringAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const attribute = selectionModel.entity.findSelectedAttributeWithSamePredicate(
    attrDef.pred
  )

  if (attribute) {
    openEditStringAttributeDialog(
      selectionModel.entity,
      attribute,
      commander,
      attrDef
    )
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModel.entity.all,
      attrDef
    )
    commander.invoke(command)
  }
}
