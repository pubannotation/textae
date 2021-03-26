export default function (eventEmitter, commander, selectionModelEntity) {
  // Bind events about attributes.
  eventEmitter.on(
    'textae-event.entity-and-attribute-pallet.attribute.tab.drop',
    (oldIndex, newIndex) => {
      commander.invoke(
        commander.factory.moveAttributeDefintionComannd(oldIndex, newIndex)
      )
    }
  )
}
