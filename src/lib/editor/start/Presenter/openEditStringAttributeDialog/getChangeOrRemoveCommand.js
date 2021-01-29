export default function (newObj, commander, attrDef, newLabel) {
  if (newObj) {
    return commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
      attrDef,
      newObj,
      newLabel
    )
  } else {
    return commander.factory.removeAttributesFromSelectedEntitiesByPredCommand(
      attrDef
    )
  }
}
