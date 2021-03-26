import delegate from 'delegate'
import alertifyjs from 'alertifyjs'
import CreateAttributeDefinitionDialog from '../../CreateAttributeDefinitionDialog'
import EditAttributeDefinitionDialog from '../../EditAttributeDefinitionDialog'
import EditValueOfAttributeDefinitionDialog from '../../EditValueOfAttributeDefinitionDialog'
import enableAttributeTabDrag from './enableAttributeTabDrag'
import enableAttributeTabDrop from './enableAttributeTabDrop'

export default function (
  pallet,
  el,
  eventEmitter,
  commander,
  selectionModelEntity
) {
  enableAttributeTabDrag(el)
  enableAttributeTabDrop(el, eventEmitter)

  delegate(el, '.textae-editor__type-pallet__attribute', 'click', (e) => {
    pallet.showAttribute(e.target.dataset['attribute'])
  })

  delegate(el, '.textae-editor__type-pallet__create-predicate', 'click', () =>
    new CreateAttributeDefinitionDialog().open().then((attrDef) => {
      // Predicate is necessary and Ignore without predicate.
      if (attrDef.pred) {
        commander.invoke(
          commander.factory.createAttributeDefinitionCommand(attrDef)
        )
      }
    })
  )

  delegate(el, '.textae-editor__type-pallet__edit-predicate', 'click', () =>
    new EditAttributeDefinitionDialog(pallet.attrDef)
      .open()
      .then((changedProperties) => {
        // Predicate is necessary and Ignore without predicate.
        if (changedProperties.size && changedProperties.get('pred') !== '') {
          commander.invoke(
            commander.factory.changeAttributeDefinitionCommand(
              pallet.attrDef,
              changedProperties
            )
          )
        }
      })
  )

  delegate(el, '.textae-editor__type-pallet__delete-predicate', 'click', () =>
    commander.invoke(
      commander.factory.deleteAttributeDefinitionCommand(pallet.attrDef)
    )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__selection-attribute-label',
    'click',
    (e) => {
      if (selectionModelEntity.selectedWithAttributeOf(pallet.attrDef.pred)) {
        if (
          selectionModelEntity.isDupulicatedPredAttrributeSelected(
            pallet.attrDef.pred
          )
        ) {
          alertifyjs.warning(
            'An item among the selected has this attribute multiple times.'
          )
        } else {
          const command = commander.factory.changeAttributesOfItemsWithSamePred(
            selectionModelEntity.all,
            pallet.attrDef,
            e.target.dataset.id
          )
          commander.invoke(command)
        }
      } else {
        const command = commander.factory.createAttributeToItemsCommand(
          selectionModelEntity.all,
          pallet.attrDef,
          e.target.dataset.id
        )
        commander.invoke(command)
      }
    }
  )

  delegate(
    el,
    '.textae-editor__type-pallet__add-attribute-value-button',
    'click',
    () =>
      new EditValueOfAttributeDefinitionDialog(pallet.attrDef.valueType)
        .open()
        .then((value) => {
          if (value.range || value.id || value.pattern) {
            commander.invoke(
              commander.factory.addValueToAttributeDefinitionCommand(
                pallet.attrDef,
                value
              )
            )
          }
        })
  )

  delegate(el, '.textae-editor__type-pallet__edit-value', 'click', (e) =>
    eventEmitter.emit(
      `textae-event.entity-and-attribute-pallet.attribute.edit-value-of-attribute-definition-button.click`,
      pallet.attrDef,
      e.target.dataset.index
    )
  )

  delegate(el, '.textae-editor__type-pallet__remove-value', 'click', (e) =>
    eventEmitter.emit(
      `textae-event.entity-and-attribute-pallet.attribute.remove-value-from-attribute-definition-button.click`,
      pallet.attrDef,
      e.target.dataset.index
    )
  )

  delegate(el, '.textae-editor__type-pallet__add-attribute', 'click', () =>
    eventEmitter.emit(
      `textae-event.entity-and-attribute-pallet.add-attribute-instance-button.click`,
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__edit-object', 'click', () =>
    eventEmitter.emit(
      'textae-event.entity-and-attribute-pallet.attribute.edit-object-of-attribute-instance-button.click',
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__remove-attribute', 'click', () =>
    eventEmitter.emit(
      `textae-event.entity-and-attribute-pallet.attribute.remove-attribute-instance-button.click`,
      pallet.attrDef
    )
  )
}
