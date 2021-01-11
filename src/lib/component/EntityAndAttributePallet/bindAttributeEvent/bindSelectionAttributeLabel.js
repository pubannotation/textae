import delegate from 'delegate'

export default function (el, pallet, callback) {
  delegate(
    el,
    '.textae-editor__type-pallet__selection-attribute-label',
    'click',
    (e) => callback(pallet.attrDef, e.target.dataset.id)
  )
}
