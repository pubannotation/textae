export default function(newObj, commander, attrDef, newLabel) {
  if (newObj) {
    return commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
      'entity',
      attrDef,
      newObj,
      newLabel
    )
  } else {
    return commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
      attrDef
    )
  }
}
