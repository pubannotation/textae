import delegate from 'delegate'

export default function(selectType, selectDefaultType, selectAllFunc) {
  const pallet = document.createElement('div')

  pallet.classList.add('textae-editor__type-pallet')
  pallet.style.display = 'none'
  pallet.appendChild(document.createElement('table'))

  delegate(pallet, '.textae-editor__type-pallet__entity-type__label', 'click', (e) => {
    pallet.style.display = 'none'
    selectType(e.delegateTarget.id)
  })

  delegate(pallet, '.textae-editor__type-pallet__entity-type__use-number', 'click', (e) => {
    let useNum = e.delegateTarget.innerText
    pallet.style.display = 'none'
    if (useNum >= 1) {
      selectAllFunc(e.delegateTarget.getAttribute('data-id'))
    }
  })

  delegate(pallet, '.textae-editor__type-pallet__entity-type__radio', 'change', (e) => {
    pallet.style.display = 'none'
    selectDefaultType(e.delegateTarget.id)
  })

  return pallet
}
