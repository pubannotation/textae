import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getValues from './getValues'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'
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

    // Observe edit an attributu button.
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

    // Observe remove an attributu button.
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__remove__value',
      'click',
      (e) => {
        const tableRow = e.target.closest(
          '.textae-editor__edit-type-dialog__attribute'
        )
        const indexOfAttribute =
          [...tableRow.parentElement.children].indexOf(tableRow) - 1
        const { typeName, attributes } = getValues(super.el)
        this._updateDisplay(
          typeName,
          attributes.filter((_, i) => i !== indexOfAttribute),
          attributeContainer,
          entityContainer
        )
      }
    )

    // Observe add an attributu button.
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__add',
      'click',
      (e) => {
        const pred = e.target.innerText
        const defaultValue = attributeContainer.get(pred).default

        const { typeName, attributes } = getValues(super.el)
        this._updateDisplay(
          typeName,
          attributes
            .concat({ pred, obj: defaultValue, id: '' })
            .sort((a, b) => attributeContainer.attributeCompareFunction(a, b)),
          attributeContainer,
          entityContainer
        )
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

  _updateDisplay(typeName, attributes, attributeContainer, entityContainer) {
    const contentHtml = createContentHTML(
      typeName,
      attributes,
      entityContainer,
      attributeContainer
    )
    super.el.closest('.ui-dialog-content').innerHTML = contentHtml
  }
}
