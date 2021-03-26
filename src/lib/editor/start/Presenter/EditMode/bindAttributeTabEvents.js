import alertifyjs from 'alertifyjs'
import EditValueOfAttributeDefinitionDialog from '../../../../component/EditValueOfAttributeDefinitionDialog'
import openEditNumericAttributeDialog from '../openEditNumericAttributeDialog'
import openEditStringAttributeDialog from '../openEditStringAttributeDialog'

export default function (eventEmitter, commander, selectionModelEntity) {
  // Bind events about attributes.
  eventEmitter
    .on(
      `textae-event.entity-and-attribute-pallet.attribute.add-value-of-attribute-definition-button.click`,
      (attrDef) => {
        new EditValueOfAttributeDefinitionDialog(attrDef.valueType)
          .open()
          .then((value) => {
            if (value.range || value.id || value.pattern) {
              commander.invoke(
                commander.factory.addValueToAttributeDefinitionCommand(
                  attrDef,
                  value
                )
              )
            }
          })
      }
    )
    .on(
      `textae-event.entity-and-attribute-pallet.attribute.value-of-attribute-definition-label.click`,
      (attrDef, newObj) => {
        if (selectionModelEntity.selectedWithAttributeOf(attrDef.pred)) {
          if (
            selectionModelEntity.isDupulicatedPredAttrributeSelected(
              attrDef.pred
            )
          ) {
            alertifyjs.warning(
              'An item among the selected has this attribute multiple times.'
            )
          } else {
            const command = commander.factory.changeAttributesOfItemsWithSamePred(
              selectionModelEntity.all,
              attrDef,
              newObj
            )
            commander.invoke(command)
          }
        } else {
          const command = commander.factory.createAttributeToItemsCommand(
            selectionModelEntity.all,
            attrDef,
            newObj
          )
          commander.invoke(command)
        }
      }
    )
    .on(
      `textae-event.entity-and-attribute-pallet.attribute.edit-value-of-attribute-definition-button.click`,
      (attrDef, index) => {
        const oldValue = attrDef.values[index]
        new EditValueOfAttributeDefinitionDialog(attrDef.valueType, oldValue)
          .open()
          .then((newValue) => {
            if (newValue.range || newValue.id || newValue.pattern) {
              const changed =
                Object.keys(newValue).reduce((acc, cur) => {
                  return acc || newValue[cur] !== oldValue[cur]
                }, false) ||
                Object.keys(oldValue).reduce((acc, cur) => {
                  return acc || newValue[cur] !== oldValue[cur]
                }, false)
              // Ignore if there is no change
              if (!changed) {
                return
              }

              commander.invoke(
                commander.factory.changeValueOfAttributeDefinitionAndObjectOfSelectionAttributeCommand(
                  attrDef.JSON,
                  index,
                  newValue
                )
              )
            }
          })
      }
    )
    .on(
      `textae-event.entity-and-attribute-pallet.attribute.remove-value-from-attribute-definition-button.click`,
      (attrDef, index) =>
        commander.invoke(
          commander.factory.removeValueFromAttributeDefinitionCommand(
            attrDef,
            index
          )
        )
    )
    .on(
      'textae-event.entity-and-attribute-pallet.add-attribute-instance-button.click',
      (attrDef) =>
        commander.invoke(
          commander.factory.createAttributeToItemsCommand(
            selectionModelEntity.all,
            attrDef
          )
        )
    )
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
