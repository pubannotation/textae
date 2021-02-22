import delegate from 'delegate'
import CreateTypeDefinitionDialog from '../../../../../../component/CreateTypeDefinitionDialog'
import EditTypeDefinitionDialog from '../../../../../../component/EditTypeDefinitionDialog'
import checkButtonEnable from './checkButtonEnable'

export default function (
  pallet,
  commander,
  handler,
  getAutocompletionWs,
  definitionContainer
) {
  delegate(
    pallet.el,
    `.textae-editor__type-pallet__add-button`,
    'click',
    () => {
      new CreateTypeDefinitionDialog(definitionContainer, getAutocompletionWs())
        .open()
        .then(({ newType }) =>
          commander.invoke(handler.addTypeDefinition(newType))
        )
    }
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
      new EditTypeDefinitionDialog(
        definitionContainer,
        e.target.dataset.id,
        e.target.dataset.color.toLowerCase(),
        e.target.dataset.isDefault === 'true',
        getAutocompletionWs()
      )
        .open()
        .then(({ id, changedProperties }) => {
          if (changedProperties.size) {
            commander.invoke(
              handler.changeTypeDefinition(id, changedProperties)
            )
          }
        })
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
