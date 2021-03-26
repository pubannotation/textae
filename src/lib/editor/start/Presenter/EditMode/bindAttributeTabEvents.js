export default function (eventEmitter, commander, selectionModelEntity) {
  // Bind events about attributes.
  eventEmitter
    .on(
      'textae-event.entity-and-attribute-pallet.attribute.remove-attribute-instance-button.click',
      (attrDef) =>
        commander.invoke(
          commander.factory.removeAttributesFromItemsByPredCommand(
            selectionModelEntity.all,
            attrDef
          )
        )
    )
    .on(
      'textae-event.entity-and-attribute-pallet.attribute.tab.drop',
      (oldIndex, newIndex) => {
        commander.invoke(
          commander.factory.moveAttributeDefintionComannd(oldIndex, newIndex)
        )
      }
    )
}
