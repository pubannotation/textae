import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import getValues from './getValues'
import bind from './bind'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class extends PromiseDialog {
  constructor(type, typeDefinition, autocompletionWs) {
    const contentHtml = createContentHtml({
      value: type.name,
      label: typeDefinition.getLabel(type.name),
      attributes: type.attributes
    })

    super(
      'Please edit type and attributes',
      contentHtml,
      {
        width: 800
      },
      '.textae-editor__edit-type-dialog__type__value__value',
      () => getValues(super.el),
      'textae-editor__edit-type-dialog__ok-button'
    )

    bind(super.el)

    // Setup autocomplete
    const value = super.el.querySelector(
      '.textae-editor__edit-type-dialog__type__value__value'
    )
    const labelSpan = super.el.querySelector(
      '.textae-editor__edit-type-dialog__type__label__value'
    )
    setSourceOfAutoComplete(typeDefinition, autocompletionWs, value, labelSpan)
  }
}
