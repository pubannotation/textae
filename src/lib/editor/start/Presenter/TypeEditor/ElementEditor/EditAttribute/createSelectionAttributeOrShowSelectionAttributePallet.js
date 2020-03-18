export default function(selectionModel, attrDef, commander, pallet) {
  const selectedEntityWithSamePred = selectionModel.entity.findSelectedWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    pallet.show()
    pallet.showAttribute(attrDef.pred)
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
