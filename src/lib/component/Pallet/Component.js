import delegate from 'delegate'

export default function(editor, selectType, selectDefaultType, selectAllFunc, removeTypeFunc) {
  const pallet = document.createElement('div')

  pallet.classList.add('textae-editor__type-pallet')
  pallet.style.display = 'none'
  pallet.appendChild(document.createElement('table'))

  delegate(pallet, '.textae-editor__type-pallet__radio', 'change', (e) => {
    selectDefaultType(e.delegateTarget.id)
    triggerUpdatePallet(editor)
  })

  delegate(pallet, '.textae-editor__type-pallet__label', 'click', (e) => {
    selectType(e.delegateTarget.id)
    triggerUpdatePallet(editor)
  })

  delegate(pallet, '.textae-editor__type-pallet__use-number__number', 'click', (e) => {
    let useNum = e.delegateTarget.getAttribute('value')
    if (useNum >= 1) {
      selectAllFunc(e.delegateTarget.getAttribute('data-id'))
      triggerUpdatePallet(editor)
    }
  })

  delegate(pallet, '.textae-editor__type-pallet__remove', 'click', (e) => {
    removeTypeFunc(
      e.delegateTarget.getAttribute('data-id'),
      e.delegateTarget.getAttribute('data-short-label')
    )
    triggerUpdatePallet(editor)
  })

  return pallet
}

function triggerUpdatePallet(editor) {
  editor.eventEmitter.emit('textae.pallet.update')
}
