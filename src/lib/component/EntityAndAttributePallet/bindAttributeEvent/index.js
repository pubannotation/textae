import delegate from 'delegate'
import CreateAttributeDefinitionDialog from '../../CreateAttributeDefinitionDialog'
import enableAttributeTabDrag from './enableAttributeTabDrag'
import enableAttributeTabDrop from './enableAttributeTabDrop'

export default function (pallet, el, eventEmitter, commander) {
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
    eventEmitter.emit(
      `textae-event.entity-and-attribute-pallet.attribute.edit-attribute-definition-button.click`,
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__delete-predicate', 'click', () =>
    eventEmitter.emit(
      `textae-event.entity-and-attribute-pallet.attribute.delete-attribute-definition-button.click`,
      pallet.attrDef
    )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__selection-attribute-label',
    'click',
    (e) =>
      eventEmitter.emit(
        `textae-event.entity-and-attribute-pallet.attribute.value-of-attribute-definition-label.click`,
        pallet.attrDef,
        e.target.dataset.id
      )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__add-attribute-value-button',
    'click',
    () =>
      eventEmitter.emit(
        `textae-event.entity-and-attribute-pallet.attribute.add-value-of-attribute-definition-button.click`,
        pallet.attrDef
      )
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
