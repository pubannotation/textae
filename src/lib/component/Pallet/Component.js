import delegate from 'delegate'
import EditTypeDialog from "./EditTypeDialog"
import CLASS_NAMES from './className'

export default function(editor, annotationData, command, typeContainer, autocompletionWs, elementEditor) {
  const pallet = createPallet()

  bindEventHandlers(pallet, elementEditor, typeContainer, editor, autocompletionWs, command)

  return pallet
}

function bindEventHandlers(pallet, elementEditor, typeContainer, editor, autocompletionWs, command) {
  delegate(pallet, '.' + CLASS_NAMES.buttonAdd, 'click', (e) => {
    openCreateTypeDialog(elementEditor, e, typeContainer, editor, autocompletionWs)
  })

  delegate(pallet, '.' + CLASS_NAMES.buttonRead, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  })

  delegate(pallet, '.' + CLASS_NAMES.buttonWrite, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.write.click')
  })

  delegate(pallet, '.' + CLASS_NAMES.label, 'click', (e) => {
    const commands = elementEditor.getHandlerForPallet().changeTypeOfSelectedElement(e.delegateTarget.id)
    command.invoke(commands, ['annotation'])
    triggerUpdatePallet(editor)
  })

  delegate(pallet, '.' + CLASS_NAMES.selectAll, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    elementEditor.getHandlerForPallet().selectAllByLabel(e.delegateTarget.getAttribute('data-id'))
  })

  delegate(pallet, '.' + CLASS_NAMES.editType, 'click', (e) => {
    openEditTypeDialog(elementEditor, e, editor, autocompletionWs)
  })

  delegate(pallet, '.' + CLASS_NAMES.remove, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    const commands = elementEditor.getHandlerForPallet().removeType(e.delegateTarget.getAttribute('data-id'), e.delegateTarget.getAttribute('data-short-label'))
    command.invoke(commands, ['configuration'])
    triggerUpdatePallet(editor)
  })
}

function openEditTypeDialog(elementEditor, e, editor, autocompletionWs) {
  const handler = elementEditor.getHandlerForPallet()
  const target = e.delegateTarget
  const id = target.getAttribute('data-id')
  const label = handler.typeContainer.getLabel(id) || ''
  const color = target.getAttribute('data-color').toLowerCase()
  const isDefault = target.getAttribute('data-is-default') === 'true'
  const done = (newId, newLabel, newColor, newDefault) => {
    invokeChangeTypeCommand(newId, id, newLabel, label, newColor, color, newDefault, isDefault, handler, editor)
  }
  const dialog = new EditTypeDialog(editor, handler.typeContainer, done, autocompletionWs, 'Please edit the type')
  dialog.update(id, label, color, isDefault)
  dialog.open()
}

function invokeChangeTypeCommand(newId, id, newLabel, label, newColor, color, newDefault, isDefault, handler, editor) {
  const changeValues = {}

  if (newId !== id) {
    changeValues.id = newId
  }

  if (newLabel !== label) {
    changeValues.label = newLabel === '' ? null : newLabel
  }

  if (newColor !== color) {
    changeValues.color = newColor === '' ? null : newColor
  }

  if (newDefault !== isDefault) {
    changeValues.default = isDefault ? null : true
  }

  if (Object.keys(changeValues).length) {
    handler.command.invoke([handler.changeType(id, changeValues)], ['annotation', 'configuration'])
    triggerUpdatePallet(editor)
  }
}

function openCreateTypeDialog(elementEditor, e, typeContainer, editor, autocompletionWs) {
  const handler = elementEditor.getHandlerForPallet()
  const target = e.delegateTarget
  const id = target.getAttribute('data-id')
  const defaultColor = typeContainer[handler.modelType].getDefaultColor()
  const done = (newId, newLabel, newColor, newDefault) => {
    if (newId === '') {
      return
    }

    const newType = {
      id: newId,
      color: newColor
    }

    if (newLabel !== '') {
      newType.label = newLabel
    }

    if (newDefault) {
      newType.default = newDefault
    }

    handler.command.invoke([handler.addType(newType)], ['configuration'])
    triggerUpdatePallet(editor)
  }
  const dialog = new EditTypeDialog(editor, handler.typeContainer, done, autocompletionWs, 'Please create a new type')
  dialog.update(id, '', defaultColor, false)
  dialog.open()
}

function createPallet() {
  const pallet = document.createElement('div')
  pallet.classList.add(CLASS_NAMES.base)
  pallet.style.display = 'none'

  const title = document.createElement('p')
  title.classList.add(CLASS_NAMES.title)
  pallet.appendChild(title)

  const titleText = document.createElement('span')
  titleText.classList.add(CLASS_NAMES.titleText)
  title.appendChild(titleText)

  const lockIcon = document.createElement('span')
  lockIcon.classList.add(CLASS_NAMES.lockIcon)
  lockIcon.innerText = 'locked'
  title.appendChild(lockIcon)

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add(CLASS_NAMES.buttons)
  buttonContainer.classList.add(CLASS_NAMES.hideWhenLocked)
  pallet.appendChild(buttonContainer)

  const addButton = document.createElement('span')
  addButton.classList.add(CLASS_NAMES.button)
  addButton.classList.add(CLASS_NAMES.buttonAdd)
  addButton.setAttribute('title', 'Add new type')
  buttonContainer.appendChild(addButton)

  const readButton = document.createElement('span')
  readButton.classList.add(CLASS_NAMES.button)
  readButton.classList.add(CLASS_NAMES.buttonRead)
  readButton.setAttribute('title', 'Import')
  buttonContainer.appendChild(readButton)

  const writeButton = document.createElement('span')
  writeButton.classList.add(CLASS_NAMES.button)
  writeButton.classList.add(CLASS_NAMES.buttonWrite)
  writeButton.setAttribute('title', 'Upload')
  buttonContainer.appendChild(writeButton)

  pallet.appendChild(document.createElement('table'))

  return pallet
}

function triggerUpdatePallet(editor) {
  editor.eventEmitter.emit('textae.pallet.update')
}

function checkButtonEnable(targetNode) {
  return !targetNode.classList.contains(CLASS_NAMES.tableButtonDisabled)
}
