import delegate from 'delegate'
import CLASS_NAMES from '../className'
import openCreateTypeDialog from './openCreateTypeDialog'
import checkButtonEnable from './checkButtonEnable'
import openEditTypeDialog from './openEditTypeDialog'

export default function(
  pallet,
  elementEditor,
  editor,
  autocompletionWs,
  commander
) {
  delegate(pallet, `.${CLASS_NAMES.buttonAdd}`, 'click', (e) => {
    openCreateTypeDialog(elementEditor, editor, autocompletionWs)
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
        .changeTypeOfSelectedElement(e.delegateTarget.id)
    )
  })

  delegate(pallet, `.${CLASS_NAMES.selectAll}`, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }
    elementEditor
      .getHandler()
      .selectAllByLabel(e.delegateTarget.getAttribute('data-id'))
  })

  delegate(pallet, `.${CLASS_NAMES.editType}`, 'click', (e) => {
    openEditTypeDialog(elementEditor, e, editor, autocompletionWs)
  })

  delegate(pallet, `.${CLASS_NAMES.remove}`, 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    commander.invoke(
      elementEditor
        .getHandler()
        .removeType(
          e.delegateTarget.getAttribute('data-id'),
          e.delegateTarget.getAttribute('data-short-label')
        )
    )
  })
}
