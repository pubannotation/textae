import delegate from 'delegate'
import CLASS_NAMES from '../className'
import openCreateTypeDefinitionDialog from './openCreateTypeDefinitionDialog'
import openEditTypeDefinitionDialog from './openEditTypeDefinitionDialog'
import checkButtonEnable from './checkButtonEnable'

export default function(
  pallet,
  elementEditor,
  editor,
  autocompletionWs,
  commander
) {
  delegate(pallet, `.${CLASS_NAMES.buttonAdd}`, 'click', (e) => {
    openCreateTypeDefinitionDialog(elementEditor, editor, autocompletionWs)
  })

  delegate(pallet, `.${CLASS_NAMES.buttonRead}`, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  })

  delegate(pallet, `.${CLASS_NAMES.buttonWrite}`, 'click', (e) => {
    editor.api.handlePalletClick('textae.pallet.button.write.click')
  })

  delegate(pallet, `.${CLASS_NAMES.label}`, 'click', (e) => {
    commander.invoke(
      elementEditor
        .getHandler()
        .changeTypeOfSelectedElement(e.delegateTarget.dataset.id)
    )
  })

  delegate(pallet, `.${CLASS_NAMES.selectAll}`, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }
    elementEditor.getHandler().selectAll(e.delegateTarget.dataset.id)
  })

  delegate(pallet, `.${CLASS_NAMES.editType}`, 'click', (e) => {
    openEditTypeDefinitionDialog(
      elementEditor,
      e.target.dataset.id,
      e.target.dataset.color.toLowerCase(),
      e.target.dataset.isDefault === 'true',
      autocompletionWs
    )
  })

  delegate(pallet, `.${CLASS_NAMES.remove}`, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    // When the user clicks the delete button, the browser focuses on the delete button.
    // If you delete a line that contains a delete button with focus, the editor loses focus.
    // Keyboard shortcuts will not work if focus is lost from the editor.
    // To prevent this, focus on the editor before deleting the line.
    editor.focus()

    commander.invoke(
      elementEditor
        .getHandler()
        .removeType(e.delegateTarget.dataset.id, e.delegateTarget.dataset.label)
    )
  })
}
