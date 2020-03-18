export default function(selectionModel, attrDef, commander, pallet, point) {
  const selectedEntityWithSamePred = selectionModel.entity.findSelectedWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    // pallet.definition = attrDef
    pallet.show(point)
    pallet.showAttribute(attrDef.pred)
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
