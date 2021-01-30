import openEditNumericAttributeDialog from '../../openEditNumericAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const selectedEntityWithSamePred = selectionModel.entity.findSelectedWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    const attribute = selectedEntityWithSamePred.attributes.find(
      (a) => a.pred === attrDef.pred
    )
    openEditNumericAttributeDialog(attrDef, attribute, commander)
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModel.entity.all,
      attrDef
    )
    commander.invoke(command)
  }
}
