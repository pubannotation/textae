import delegate from 'delegate'
import CLASS_NAMES from '../className'
import openCreateTypeDialog from './openCreateTypeDialog'
import checkButtonEnable from './checkButtonEnable'
import triggerUpdatePallet from './triggerUpdatePallet'
import openEditTypeDialog from './openEditTypeDialog'

export default function(pallet, elementEditor, typeContainer, editor, autocompletionWs, command) {
  delegate(pallet, `.${CLASS_NAMES.buttonAdd}`, 'click', (e) => {
    openCreateTypeDialog(elementEditor, e, typeContainer, editor, autocompletionWs)
  })

  delegate(pallet, `.${CLASS_NAMES.buttonRead}`, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  })

  delegate(pallet, `.${CLASS_NAMES.buttonWrite}`, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.write.click')
  })

  delegate(pallet, `.${CLASS_NAMES.label}`, 'click', (e) => {
    console.log('hi')
    const commands = elementEditor.getHandlerForPallet().changeTypeOfSelectedElement(e.delegateTarget.id)
    command.invoke(commands, ['annotation'])
    triggerUpdatePallet(editor)
  })

  delegate(pallet, `.${CLASS_NAMES.selectAll}`, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }
    elementEditor.getHandlerForPallet().selectAllByLabel(e.delegateTarget.getAttribute('data-id'))
  })

  delegate(pallet, `.${CLASS_NAMES.editType}`, 'click', (e) => {
    openEditTypeDialog(elementEditor, e, editor, autocompletionWs)
  })

  delegate(pallet, `.${CLASS_NAMES.remove}`, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }
    const commands = elementEditor.getHandlerForPallet().removeType(e.delegateTarget.getAttribute('data-id'), e.delegateTarget.getAttribute('data-short-label'))
    command.invoke(commands, ['configuration'])
    triggerUpdatePallet(editor)
  })
}
