import EditNumericAttributeDialog from '../../../../../component/EditNumericAttributeDialog'

export default function(selectionModel, attrDef, commander) {
  const selectedEntitiesWithSamePred = selectionModel.getSelectedEntitiesWithSamePredicateAttribute(
    attrDef
  )
  if (selectedEntitiesWithSamePred.length > 0) {
    const attribute = selectedEntitiesWithSamePred[0].attributes.find(
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
    const command = commander.factory.createUnknownAttributeToSelectedEntitiesCommand(
      attrDef
    )
    commander.invoke(command)
  }
}
