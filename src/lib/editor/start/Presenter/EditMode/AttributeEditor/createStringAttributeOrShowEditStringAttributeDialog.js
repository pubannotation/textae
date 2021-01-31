import openEditStringAttributeDialog from '../../openEditStringAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const selectedEntityWithSamePred = selectionModel.entity.findSelectedWithSamePredicateAttribute(
    attrDef.pred
  )
  if (selectedEntityWithSamePred) {
    const attribute = selectedEntityWithSamePred.attributes.find(
      (a) => a.pred === attrDef.pred
    )
    openEditStringAttributeDialog(
      selectionModel.entity,
      attribute,
      commander,
      attrDef
    )
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModel.entity.all,
      attrDef
    )
    commander.invoke(command)
  }
}
