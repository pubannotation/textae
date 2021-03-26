import openEditNumericAttributeDialog from '../openEditNumericAttributeDialog'
import openEditStringAttributeDialog from '../openEditStringAttributeDialog'

export default function (eventEmitter, commander, selectionModelEntity) {
  // Bind events about attributes.
  eventEmitter
    .on(
      'textae-event.entity-and-attribute-pallet.attribute.edit-object-of-attribute-instance-button.click',
      (attrDef) => {
        const attribute = selectionModelEntity.findSelectedAttributeWithSamePredicate(
          attrDef.pred
        )
        switch (attrDef.valueType) {
          case 'numeric':
            openEditNumericAttributeDialog(
              selectionModelEntity,
              attrDef,
              attribute,
              commander
            )
            break
          case 'string':
            openEditStringAttributeDialog(
              selectionModelEntity,
              attribute,
              commander,
              attrDef
            )
            break
          default:
            throw new Error(`Invalid attribute valueType: ${attrDef.valueType}`)
        }
      }
    )
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
