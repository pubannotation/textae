import delegate from 'delegate'

export default function(editor, selectType, selectDefaultType, selectAllFunc, removeTypeFunc) {
  const pallet = document.createElement('div')
  pallet.classList.add('textae-editor__type-pallet')
  pallet.style.display = 'none'

  let title = document.createElement('p')
  title.classList.add('textae-editor__type-pallet__title')
  title.innerText = 'Edit Configurations'

  let buttonContainer = document.createElement('div')
  buttonContainer.classList.add('textae-editor__type-pallet__buttons')

  let readButton = document.createElement('span')
  readButton.classList.add('textae-editor__type-pallet__button')
  readButton.classList.add('textae-editor__type-pallet__button--read')
  readButton.setAttribute('title', 'Import')

  let writeButton = document.createElement('span')
  writeButton.classList.add('textae-editor__type-pallet__button')
  writeButton.classList.add('textae-editor__type-pallet__button--write')
  writeButton.setAttribute('title', 'Upload')

  buttonContainer.appendChild(readButton)
  buttonContainer.appendChild(writeButton)
  pallet.appendChild(title)
  pallet.appendChild(buttonContainer)
  pallet.appendChild(document.createElement('table'))
  pallet.appendChild(document.createElement('table'))

  delegate(pallet, '.textae-editor__type-pallet__button--read', 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  })

  delegate(pallet, '.textae-editor__type-pallet__button--write', 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.write.click')
  })

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
