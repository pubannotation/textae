import CreateAttributeDefinitionDialog from '../../../../component/CreateAttributeDefinitionDialog'
import EditAttributeDefinitionDialog from '../../../../component/EditAttributeDefinitionDialog'
import EditValueToAttributeDefinitionDialog from '../../../../component/EditValueOfAttributeDefinitionDialog'
import openEditNumericAttributeDialog from '../openEditNumericAttributeDialog'
import openEditStringAttributeDialog from '../openEditStringAttributeDialog'

export default function(
  eventEmitter,
  commander,
  selectionModelEntity,
  entityPallet
) {
  // Bind events about attributes.
  eventEmitter
    .on(`textae.entityPallet.attribute.create-predicate-button.click`, () => {
      const dialog = new CreateAttributeDefinitionDialog()
      dialog.promise.then((attrDef) => {
        // Predicate is necessary and Ignore without predicate.
        if (attrDef.pred) {
          commander.invoke(
            commander.factory.createAttributeDefinitionCommand(
              'entity',
              attrDef
            )
          )
        }
      })
      dialog.open()
    })
    .on(
      `textae.entityPallet.attribute.edit-predicate-button.click`,
      (attrDef) => {
        const dialog = new EditAttributeDefinitionDialog(attrDef)
        dialog.promise.then((changedProperties) => {
          // Predicate is necessary and Ignore without predicate.
          if (changedProperties.size && changedProperties.get('pred') !== '') {
            commander.invoke(
              commander.factory.changeAttributeDefinitionCommand(
                'entity',
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
      `textae.entityPallet.attribute.delete-predicate-button.click`,
      (attrDef) =>
        commander.invoke(
          commander.factory.deleteAttributeDefinitionCommand('entity', attrDef)
        )
    )
    .on(`textae.entityPallet.attribute.add-value-button.click`, (attrDef) => {
      const dialog = new EditValueToAttributeDefinitionDialog(attrDef.valueType)
      dialog.promise.then((value) => {
        if (value.range || value.id || value.pattern) {
          commander.invoke(
            commander.factory.addValueToAttributeDefinitionCommand(
              'entity',
              attrDef,
              value
            )
          )
        }
      })
      dialog.open()
    })
    .on(
      `textae.entityPallet.attribute.edit-value-button.click`,
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
                'entity',
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
      `textae.entityPallet.attribute.remove-value-button.click`,
      (attrDef, index) =>
        commander.invoke(
          commander.factory.removeValueFromAttributeDefinitionCommand(
            'entity',
            attrDef,
            index
          )
        )
    )
    .on('textae.entityPallet.attribute.add-button.click', (attrDef) =>
      commander.invoke(
        commander.factory.createAttributeToSelectedEntitiesCommand(attrDef)
      )
    )
    .on('textae.entityPallet.attribute.object.edit', (attrDef) => {
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
        case 'selection':
          entityPallet.show()
          entityPallet.showAttribute(attrDef.pred)
          break
        case 'string':
          openEditStringAttributeDialog(attribute, commander, attrDef)
          break
        default:
          throw new Error(`Invalid attribute valueType: ${attrDef.valueType}`)
      }
    })
    .on('textae.entityPallet.attribute.remove-button.click', (attrDef) =>
      commander.invoke(
        commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
          attrDef
        )
      )
    )
    .on('textae.entityPallet.attribute.tab.drop', (oldIndex, newIndex) => {
      commander.invoke(
        commander.factory.moveAttributeDefintionComannd(oldIndex, newIndex)
      )
    })
}
