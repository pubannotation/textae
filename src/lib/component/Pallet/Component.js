import delegate from 'delegate'

export default function(selectType, selectDefaultType, selectAllFunc, removeTypeFunc) {
  const pallet = document.createElement('div')

  pallet.classList.add('textae-editor__type-pallet')
  pallet.style.display = 'none'
  pallet.appendChild(document.createElement('table'))

  delegate(pallet, '.textae-editor__type-pallet__radio', 'change', (e) => {
    pallet.style.display = 'none'
    selectDefaultType(e.delegateTarget.id)
  })

  delegate(pallet, '.textae-editor__type-pallet__label', 'click', (e) => {
    pallet.style.display = 'none'
    selectType(e.delegateTarget.id)
  })

  delegate(pallet, '.textae-editor__type-pallet__use-number__number', 'click', (e) => {
    let useNum = e.delegateTarget.getAttribute('value')
    pallet.style.display = 'none'
    if (useNum >= 1) {
      selectAllFunc(e.delegateTarget.getAttribute('data-id'))
    }
  })

  delegate(pallet, '.textae-editor__type-pallet__remove', 'click', (e) => {
    pallet.style.display = 'none'
    removeTypeFunc(
      e.delegateTarget.getAttribute('data-id'),
      e.delegateTarget.getAttribute('data-short-label')
    )
  })

  return pallet
}
