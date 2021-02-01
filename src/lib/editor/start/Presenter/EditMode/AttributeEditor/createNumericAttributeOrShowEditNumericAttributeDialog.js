import openEditNumericAttributeDialog from '../../openEditNumericAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const attribute = selectionModel.entity.findSelectedAttributeWithSamePredicate(
    attrDef.pred
  )

  if (attribute) {
    openEditNumericAttributeDialog(attrDef, attribute, commander)
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModel.entity.all,
      attrDef
    )
    commander.invoke(command)
  }
}
