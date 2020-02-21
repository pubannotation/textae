export default function(selectionModel, attrDef, commander, pallet, point) {
  const selectedEntityWithSamePred = selectionModel.findSelectedEntityWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    pallet.definition = attrDef
    pallet.show(point)
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
