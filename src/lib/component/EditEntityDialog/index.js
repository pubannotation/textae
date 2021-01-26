import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getValues from './getValues'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'
import observeRemoveAttributeButton from './observeRemoveAttributeButton'
import createContentHTML from './createContentHTML'

export default class EditEntityDialog extends PromiseDialog {
  constructor(
    editor,
    entityContainer,
    attributeContainer,
    autocompletionWs,
    typeValues
  ) {
    const { typeName, attributes } = typeValues
    const contentHtml = createContentHTML(
      typeName,
      attributes,
      entityContainer,
      attributeContainer
    )

    super(
      'Please edit type and attributes',
      contentHtml,
      {
        minHeight: 300,
        width: 800
      },
      () => getValues(super.el)
    )

    observeRemoveAttributeButton(super.el)

    // Observe edit an attributu button
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__edit__value',
      'click',
      (e) => {
        super.close()
        const pred = e.target.dataset.predicate
        const attrDef = attributeContainer.get(pred)
        editor.eventEmitter.emit(
          'textae.editTypeDialog.attribute.value.edit',
          attrDef
        )
      }
    )

    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__add',
      'click',
      (e) => {
        const pred = e.target.innerText
        const defaultValue = attributeContainer.get(pred).default

        const { typeName, attributes } = getValues(super.el)
        const contentHtml = createContentHTML(
          typeName,
          attributes
            .concat({ pred, obj: defaultValue, id: '' })
            .sort((a, b) => attributeContainer.attributeCompareFunction(a, b)),
          entityContainer,
          attributeContainer
        )
        super.el.closest('.ui-dialog-content').innerHTML = contentHtml
      }
    )

    // Setup autocomplete
    const value = super.el.querySelector(
      '.textae-editor__edit-type-dialog__type__value__value'
    )
    const labelSpan = super.el.querySelector(
      '.textae-editor__edit-type-dialog__type__label__value'
    )
    setSourceOfAutoComplete(value, labelSpan, autocompletionWs, (term) =>
      entityContainer.findByLabel(term)
    )
  }
}
