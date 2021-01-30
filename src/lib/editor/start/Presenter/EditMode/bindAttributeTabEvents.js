import CreateAttributeDefinitionDialog from '../../../../component/CreateAttributeDefinitionDialog'
import EditAttributeDefinitionDialog from '../../../../component/EditAttributeDefinitionDialog'
import EditValueToAttributeDefinitionDialog from '../../../../component/EditValueOfAttributeDefinitionDialog'
import openEditNumericAttributeDialog from '../openEditNumericAttributeDialog'
import openEditStringAttributeDialog from '../openEditStringAttributeDialog'

export default function (eventEmitter, commander, selectionModelEntity) {
  // Bind events about attributes.
  eventEmitter
    .on(
      `textae.entityAndAttributePallet.attribute.create-predicate-button.click`,
      () => {
        const dialog = new CreateAttributeDefinitionDialog()
        dialog.promise.then((attrDef) => {
          // Predicate is necessary and Ignore without predicate.
          if (attrDef.pred) {
            commander.invoke(
              commander.factory.createAttributeDefinitionCommand(attrDef)
            )
          }
        })
        dialog.open()
      }
    )
    .on(
      `textae.entityAndAttributePallet.attribute.edit-predicate-button.click`,
      (attrDef) => {
        const dialog = new EditAttributeDefinitionDialog(attrDef)
        dialog.promise.then((changedProperties) => {
          // Predicate is necessary and Ignore without predicate.
          if (changedProperties.size && changedProperties.get('pred') !== '') {
            commander.invoke(
              commander.factory.changeAttributeDefinitionCommand(
                attrDef,
                changedProperties
              )
            )
          }
        })
        dialog.open()
      }
    )
    .on(
      `textae.entityAndAttributePallet.attribute.delete-predicate-button.click`,
      (attrDef) =>
        commander.invoke(
          commander.factory.deleteAttributeDefinitionCommand(attrDef)
        )
    )
    .on(
      `textae.entityAndAttributePallet.attribute.add-value-button.click`,
      (attrDef) => {
        const dialog = new EditValueToAttributeDefinitionDialog(
          attrDef.valueType
        )
        dialog.promise.then((value) => {
          if (value.range || value.id || value.pattern) {
            commander.invoke(
              commander.factory.addValueToAttributeDefinitionCommand(
                attrDef,
                value
              )
            )
          }
        })
        dialog.open()
      }
    )
    .on(
      `textae.entityAndAttributePallet.attribute.edit-value-button.click`,
      (attrDef, index) => {
        const oldValue = attrDef.JSON.values[index]
        const dialog = new EditValueToAttributeDefinitionDialog(
          attrDef.valueType,
          oldValue
        )
        dialog.promise.then((newValue) => {
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
        dialog.open()
      }
    )
    .on(
      `textae.entityAndAttributePallet.attribute.remove-value-button.click`,
      (attrDef, index) =>
        commander.invoke(
          commander.factory.removeValueFromAttributeDefinitionCommand(
            attrDef,
            index
          )
        )
    )
    .on(
      'textae.entityAndAttributePallet.attribute.add-button.click',
      (attrDef) =>
        commander.invoke(
          commander.factory.createAttributeToItemsCommand(
            selectionModelEntity.all,
            attrDef
          )
        )
    )
    .on('textae.entityAndAttributePallet.attribute.object.edit', (attrDef) => {
      const selectedEntityWithSamePred = selectionModelEntity.findSelectedWithSamePredicateAttribute(
        attrDef
      )
      const attribute = selectedEntityWithSamePred.attributes.find(
        (a) => a.pred === attrDef.pred
      )

      switch (attrDef.valueType) {
        case 'numeric':
          openEditNumericAttributeDialog(attrDef, attribute, commander)
          break
        case 'string':
          openEditStringAttributeDialog(attribute, commander, attrDef)
          break
        default:
          throw new Error(`Invalid attribute valueType: ${attrDef.valueType}`)
      }
    })
    .on(
      'textae.entityAndAttributePallet.attribute.remove-attribute-instance-button.click',
      (attrDef) =>
        commander.invoke(
          commander.factory.removeAttributesFromSelectedEntitiesByPredCommand(
            attrDef
          )
        )
    )
    .on(
      'textae.entityAndAttributePallet.attribute.tab.drop',
      (oldIndex, newIndex) => {
        commander.invoke(
          commander.factory.moveAttributeDefintionComannd(oldIndex, newIndex)
        )
      }
    )
}
