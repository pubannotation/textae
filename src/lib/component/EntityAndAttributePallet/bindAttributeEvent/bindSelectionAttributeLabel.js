import delegate from 'delegate'

export default function (el, eventEmitter, pallet) {
  delegate(
    el,
    '.textae-editor__type-pallet__selection-attribute-label',
    'click',
    (e) =>
      eventEmitter.emit(
        `textae.entityAndAttributePallet.attribute.selection-attribute-label.click`,
        pallet.attrDef,
        e.target.dataset.id
      )
  )
}
