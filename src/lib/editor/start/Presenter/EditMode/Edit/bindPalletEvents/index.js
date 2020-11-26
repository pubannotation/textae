import delegate from 'delegate'
import CreateTypeDefinitionDialog from '../../../../../../component/CreateTypeDefinitionDialog'
import EditTypeDefinitionDialog from '../../../../../../component/EditTypeDefinitionDialog'
import checkButtonEnable from './checkButtonEnable'

export default function (
  pallet,
  editor,
  commander,
  handler,
  getAutocompletionWs,
  typeContainer
) {
  delegate(
    pallet.el,
    `.textae-editor__type-pallet__add-button`,
    'click',
    () => {
      const dialog = new CreateTypeDefinitionDialog(
        typeContainer,
        getAutocompletionWs()
      )
      dialog.promise.then(({ newType }) =>
        commander.invoke(handler.addType(newType))
      )
      dialog.open()
    }
  )

  delegate(pallet.el, `.textae-editor__type-pallet__read-button`, 'click', () =>
    editor.api.handlePalletClick('textae.pallet.button.read.click')
  )

  delegate(
    pallet.el,
    '.textae-editor__type-pallet__write-button',
    'click',
    () => editor.api.handlePalletClick('textae.pallet.button.write.click')
  )

  delegate(pallet.el, '.textae-editor__type-pallet__label', 'click', (e) =>
    commander.invoke(
      handler.changeTypeOfSelectedElement(e.delegateTarget.dataset.id)
    )
  )

  delegate(
    pallet.el,
    '.textae-editor__type-pallet__select-all',
    'click',
    (e) => {
      if (!checkButtonEnable(e.target)) {
        return
      }

      handler.selectAll(e.delegateTarget.dataset.id)
    }
  )

  delegate(
    pallet.el,
    '.textae-editor__type-pallet__edit-type',
    'click',
    (e) => {
      const dialog = new EditTypeDefinitionDialog(
        typeContainer,
        e.target.dataset.id,
        e.target.dataset.color.toLowerCase(),
        e.target.dataset.isDefault === 'true',
        getAutocompletionWs()
      )
      dialog.promise.then(({ id, changedProperties }) => {
        if (changedProperties.size) {
          commander.invoke(handler.changeType(id, changedProperties))
        }
      })
      dialog.open()
    }
  )

  delegate(pallet.el, '.textae-editor__type-pallet__remove', 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    commander.invoke(
      handler.removeType(
        e.delegateTarget.dataset.id,
        e.delegateTarget.dataset.label
      )
    )
  })
}
