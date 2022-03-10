import delegate from 'delegate'
import CreateTypeDefinitionDialog from '../../../../../../component/CreateTypeDefinitionDialog'
import EditTypeDefinitionDialog from '../../../../../../component/EditTypeDefinitionDialog'
import checkButtonEnable from './checkButtonEnable'

export default function (
  pallet,
  commander,
  getAutocompletionWs,
  definitionContainer,
  annotationType,
  selectionModel,
  annotationData
) {
  delegate(pallet.el, `.textae-editor__pallet__add-button`, 'click', () => {
    new CreateTypeDefinitionDialog(definitionContainer, getAutocompletionWs())
      .open()
      .then(({ newType }) =>
        commander.invoke(
          commander.factory.createTypeDefinitionCommand(
            definitionContainer,
            newType
          )
        )
      )
  })

  delegate(pallet.el, '.textae-editor__pallet__label', 'click', (e) =>
    commander.invoke(
      commander.factory.changeTypeOfSelectedItemsCommand(
        annotationType,
        e.delegateTarget.dataset.id
      )
    )
  )

  delegate(pallet.el, '.textae-editor__pallet__select-all', 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }

    selectionModel.removeAll()
    for (const { id } of annotationData[annotationType].findByType(
      e.delegateTarget.dataset.id
    )) {
      selectionModel[annotationType].add(id)
    }
  })

  delegate(pallet.el, '.textae-editor__pallet__edit-type', 'click', (e) => {
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
            commander.factory.changeTypeDefinitionCommand(
              definitionContainer,
              annotationType,
              id,
              changedProperties
            )
          )
        }
      })
  })

  delegate(pallet.el, '.textae-editor__pallet__remove', 'click', (e) => {
    if (!checkButtonEnable(e.target)) {
      return
    }
    const { id } = e.delegateTarget.dataset
    const { label } = e.delegateTarget.dataset

    const removeType = {
      id,
      label: label || ''
    }

    if (typeof id === 'undefined') {
      throw new Error('You must set the type id to remove.')
    }

    commander.invoke(
      commander.factory.removeTypeDefinitionCommand(
        definitionContainer,
        removeType
      )
    )
  })
}
