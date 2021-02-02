import delegate from 'delegate'
import enableAttributeTabDrag from './enableAttributeTabDrag'
import enableAttributeTabDrop from './enableAttributeTabDrop'

export default function (pallet, el, eventEmitter) {
  enableAttributeTabDrag(el)
  enableAttributeTabDrop(el, eventEmitter)

  delegate(el, '.textae-editor__type-pallet__attribute', 'click', (e) => {
    pallet.showAttribute(e.target.dataset['attribute'])
  })

  delegate(el, '.textae-editor__type-pallet__create-predicate', 'click', () =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.attribute.create-attribute-definition-button.click`
    )
  )

  delegate(el, '.textae-editor__type-pallet__edit-predicate', 'click', () =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.attribute.edit-attribute-definition-button.click`,
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__delete-predicate', 'click', () =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.attribute.delete-attribute-definition-button.click`,
      pallet.attrDef
    )
  )

  delegate(
    el,
    '.textae-editor__type-pallet__add-attribute-value-button',
    'click',
    () =>
      eventEmitter.emit(
        `textae.entityAndAttributePallet.attribute.add-value-button.click`,
        pallet.attrDef
      )
  )

  delegate(el, '.textae-editor__type-pallet__edit-value', 'click', (e) =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.attribute.edit-value-button.click`,
      pallet.attrDef,
      e.target.dataset.index
    )
  )

  delegate(el, '.textae-editor__type-pallet__remove-value', 'click', (e) =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.attribute.remove-value-button.click`,
      pallet.attrDef,
      e.target.dataset.index
    )
  )

  delegate(el, '.textae-editor__type-pallet__add-attribute', 'click', () =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.add-attribute-instance-button.click`,
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__edit-object', 'click', () =>
    eventEmitter.emit(
      'textae.entityAndAttributePallet.attribute.edit-attribute-instance-button.click',
      pallet.attrDef
    )
  )

  delegate(el, '.textae-editor__type-pallet__remove-attribute', 'click', () =>
    eventEmitter.emit(
      `textae.entityAndAttributePallet.attribute.remove-attribute-instance-button.click`,
      pallet.attrDef
    )
  )
}
