import openEditStringAttributeDialog from '../../openEditStringAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const selectedEntityWithSamePred = selectionModel.entity.findSelectedWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    const attribute = selectedEntityWithSamePred.attributes.find(
      (a) => a.pred === attrDef.pred
    )
    openEditStringAttributeDialog(attribute, commander, attrDef)
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
