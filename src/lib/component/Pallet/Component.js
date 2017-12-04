import delegate from 'delegate'
import EditTypeDialog from "./EditTypeDialog"
import CLASS_NAMES from './className'

export default function(editor, annotationData, command, typeContainer, autocompletionWs, elementEditor) {
  const pallet = document.createElement('div')
  pallet.classList.add(CLASS_NAMES.base)
  pallet.style.display = 'none'

  let title = document.createElement('p')
  title.classList.add(CLASS_NAMES.title)
  title.innerText = 'Edit Configurations'

  let lockIcon = document.createElement('span')
  lockIcon.classList.add(CLASS_NAMES.lockIcon)
  lockIcon.innerText = 'locked'

  let buttonContainer = document.createElement('div')
  buttonContainer.classList.add(CLASS_NAMES.buttons)
  buttonContainer.classList.add(CLASS_NAMES.hideWhenLocked)

  let addButton = document.createElement('span')
  addButton.classList.add(CLASS_NAMES.button)
  addButton.classList.add(CLASS_NAMES.buttonAdd)
  addButton.setAttribute('title', 'Add new type')

  let readButton = document.createElement('span')
  readButton.classList.add(CLASS_NAMES.button)
  readButton.classList.add(CLASS_NAMES.buttonRead)
  readButton.setAttribute('title', 'Import')

  let writeButton = document.createElement('span')
  writeButton.classList.add(CLASS_NAMES.button)
  writeButton.classList.add(CLASS_NAMES.buttonWrite)
  writeButton.setAttribute('title', 'Upload')

  title.appendChild(lockIcon)
  buttonContainer.appendChild(addButton)
  buttonContainer.appendChild(readButton)
  buttonContainer.appendChild(writeButton)
  pallet.appendChild(title)
  pallet.appendChild(buttonContainer)
  pallet.appendChild(document.createElement('table'))
  pallet.appendChild(document.createElement('table'))

  delegate(pallet, '.' + CLASS_NAMES.buttonAdd, 'click', (e) => {
    let handler = elementEditor.getHandlerForPallet(),
      target = e.delegateTarget,
      id = target.getAttribute('data-id'),
      defaultColor = typeContainer[handler.modelType].getDefaultColor(),
      done = (newId, newLabel, newColor, newDefault) => {
        if (newId === '') return

        let newType = {id: newId}
        if (newLabel !== '') newType.label = newLabel
        if (newColor !== defaultColor) newType.color = newColor
        if (newDefault) newType.default = newDefault

        handler.command.invoke([handler.addType(newType)])
      },
      dialog = new EditTypeDialog(editor, handler.typeContainer, done, autocompletionWs, 'Please create a new type')

    dialog.update(id, '', defaultColor, false)
    dialog.open()
  })

  delegate(pallet, '.' + CLASS_NAMES.buttonRead, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  })

  delegate(pallet, '.' + CLASS_NAMES.buttonWrite, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.write.click')
  })

  delegate(pallet, '.' + CLASS_NAMES.label, 'click', (e) => {
    const commands = elementEditor.getHandlerForPallet().changeTypeOfSelectedElement(e.delegateTarget.id)
    command.invoke(commands)
    triggerUpdatePallet(editor)
    // Focus the editor to prevent lost focus when the pallet is closed during selecting radio buttons.
    editor[0].focus()
  })

  delegate(pallet, '.' + CLASS_NAMES.selectAll, 'click', (e) => {
    if (!checkButtonEnable(e.target)) return

    elementEditor.getHandlerForPallet().selectAllByLabel(e.delegateTarget.getAttribute('data-id'))
    // Focus the editor to prevent lost focus when the pallet is closed during selecting radio buttons.
    editor[0].focus()
  })

  delegate(pallet, '.' + CLASS_NAMES.editType, 'click', (e) => {
    let handler = elementEditor.getHandlerForPallet(),
      target = e.delegateTarget,
      id = target.getAttribute('data-id'),
      label = handler.typeContainer.getLabel(id) || '',
      color = target.getAttribute('data-color').toLowerCase(),
      isDefault = target.getAttribute('data-is-default') === 'true',
      done = (newId, newLabel, newColor, newDefault) => {
        let newType = {}
        if (newId !== id) newType.id = newId
        if (newLabel !== label) newType.label = newLabel
        if (newColor !== color) newType.color = newColor
        if (newDefault !== isDefault) newType.default = newDefault

        if (Object.keys(newType).length) {
          handler.command.invoke([handler.changeType(id, newType)])
        }
      },
      dialog = new EditTypeDialog(editor, handler.typeContainer, done, autocompletionWs, 'Please edit the type')

    dialog.update(id, label, color, isDefault)
    dialog.open()
  })

  delegate(pallet, '.' + CLASS_NAMES.remove, 'click', (e) => {
    if (!checkButtonEnable(e.target)) return

    const commands = elementEditor.getHandlerForPallet().removeType(e.delegateTarget.getAttribute('data-id'), e.delegateTarget.getAttribute('data-short-label'))
    command.invoke(commands)
    // Focus the editor to prevent lost focus when the pallet is closed during selecting radio buttons.
    editor[0].focus()
  })

  return pallet
}

function triggerUpdatePallet(editor) {
  editor.eventEmitter.emit('textae.pallet.update')
}

function checkButtonEnable(targetNode) {
  return !targetNode.classList.contains(CLASS_NAMES.tableButtonDisabled)
}
