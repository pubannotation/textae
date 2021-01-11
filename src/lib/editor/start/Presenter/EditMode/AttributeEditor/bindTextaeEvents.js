export default function (editor, selectionModel, commander) {
  editor.eventEmitter.on(
    'textae.entityAndAttributePallet.attribute.selection-attribute-label.click',
    (attrDef, newObj) => {
      if (selectionModel.entity.isSamePredAttrributeSelected(attrDef.pred)) {
        const command = commander.factory.changeAttributesOfSelectedEntitiesWithSamePred(
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
}
