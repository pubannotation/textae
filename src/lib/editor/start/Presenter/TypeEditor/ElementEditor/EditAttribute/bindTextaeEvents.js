export default function(editor, selectionModel, commander) {
  editor.eventEmitter
    .on(
      'textae.entityPallet.attribute.selection-attribute-label.click',
      (attrDef, newObj) => {
        if (selectionModel.entity.isSamePredAttrributeSelected(attrDef.pred)) {
          const command = commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
            'entity',
            attrDef,
            newObj
          )
          commander.invoke(command)
        } else {
          const command = commander.factory.createAttributeToSelectedEntitiesCommand(
            attrDef,
            newObj
          )
          commander.invoke(command)
        }
      }
    )
    .on('textae.selecionAttributePallet.remove-button.click', (attrDef) => {
      const command = commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
        attrDef
      )
      commander.invoke(command)
    })
}
