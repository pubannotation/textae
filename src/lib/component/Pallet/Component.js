import delegate from 'delegate'

export default function(editor, selectType, selectDefaultType, selectAllFunc, removeTypeFunc, createTypeFunc) {
  const pallet = document.createElement('div')
  pallet.classList.add('textae-editor__type-pallet')
  pallet.style.display = 'none'

  let title = document.createElement('p')
  title.classList.add('textae-editor__type-pallet__title')
  title.innerText = 'Edit Configurations'

  let lockIcon = document.createElement('span')
  lockIcon.classList.add('textae-editor__type-pallet__lock-icon')
  lockIcon.innerText = 'locked'

  let buttonContainer = document.createElement('div')
  buttonContainer.classList.add('textae-editor__type-pallet__buttons')

  let addButton = document.createElement('span')
  addButton.classList.add('textae-editor__type-pallet__button')
  addButton.classList.add('textae-editor__type-pallet__button--add')
  addButton.setAttribute('title', 'Add new type')

  let readButton = document.createElement('span')
  readButton.classList.add('textae-editor__type-pallet__button')
  readButton.classList.add('textae-editor__type-pallet__button--read')
  readButton.setAttribute('title', 'Import')

  let writeButton = document.createElement('span')
  writeButton.classList.add('textae-editor__type-pallet__button')
  writeButton.classList.add('textae-editor__type-pallet__button--write')
  writeButton.setAttribute('title', 'Upload')

  title.appendChild(lockIcon)
  buttonContainer.appendChild(addButton)
  buttonContainer.appendChild(readButton)
  buttonContainer.appendChild(writeButton)
  pallet.appendChild(title)
  pallet.appendChild(buttonContainer)
  pallet.appendChild(document.createElement('table'))
  pallet.appendChild(document.createElement('table'))

  delegate(pallet, '.textae-editor__type-pallet__button--add', 'click', (e) => {
    createTypeFunc()
  })

  delegate(pallet, '.textae-editor__type-pallet__button--read', 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  })

  delegate(pallet, '.textae-editor__type-pallet__button--write', 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.write.click')
  })

  delegate(pallet, '.textae-editor__type-pallet__label', 'click', (e) => {
    selectType(e.delegateTarget.id)
    triggerUpdatePallet(editor)
  })

  delegate(pallet, '.textae-editor__type-pallet__select-all', 'click', (e) => {
    let useNum = e.delegateTarget.getAttribute('data-use-number')
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
