import EditNumericAttributeDialog from '../../../../../component/EditNumericAttributeDialog'

export default function(selectionModel, attrDef, commander) {
  const selectedEntityWithSamePred = selectionModel.findSelectedEntityWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntityWithSamePred) {
    const attribute = selectedEntityWithSamePred.attributes.find(
      (a) => a.pred === attrDef.pred
    )
    const dialog = new EditNumericAttributeDialog(attrDef, attribute)
    dialog.promise.then(({ newObj }) => {
      const command = commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
        attrDef,
        newObj
      )
      commander.invoke(command)
    })
    dialog.open()
  } else {
    const command = commander.factory.createAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
