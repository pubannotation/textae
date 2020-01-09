import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import getValues from './getValues'
import bind from './bind'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class extends Dialog {
  constructor(type, done, typeDefinition, autocompletionWs) {
    const contentHtml = createContentHtml({
      value: type.name,
      label: typeDefinition.getLabel(type.name),
      attributes: type.attributes
    })

    const onOk = (content) => {
      const { typeName, label, attributes } = getValues(content)
      done(typeName, label, attributes)
    }

    super(
      'Please edit type and attributes',
      contentHtml,
      {
        label: 'OK',
        handler: onOk,
        class: 'textae-editor__edit-type-dialog__ok-button'
      },
      {
        width: 800
      }
    )

    bind(super.el, onOk)

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
