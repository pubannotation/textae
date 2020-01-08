export default function getChangeOrRemoveCommand(newObj, commander, attrDef) {
  if (newObj) {
    return commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
      attrDef,
      newObj
    )
  } else {
    return commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
      attrDef
    )
  }
}
