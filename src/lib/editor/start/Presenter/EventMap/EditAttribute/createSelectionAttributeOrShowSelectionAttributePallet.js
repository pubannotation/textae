export default function(selectionModel, attrDef, commander, pallet, point) {
  const selectedEntitiesWithSamePred = selectionModel.getSelectedEntitiesWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntitiesWithSamePred.length > 0) {
    pallet.definition = attrDef
    pallet.show(point)
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
