import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import getValues from './getValues'
import bind from './bind'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class extends PromiseDialog {
  constructor(editor, type, typeContainer, autocompletionWs) {
    const contentHtml = createContentHtml({
      value: type.name,
      label: typeContainer.getLabel(type.name),
      attributes: type.attributes.map((a) => ({
        pred: a.pred,
        obj: a.obj,
        editDisabled: a.obj === true
      }))
    })

    super(
      'Please edit type and attributes',
      contentHtml,
      {
        minHeight: 300,
        width: 800
      },
      '.textae-editor__edit-type-dialog__type__value__value',
      () => getValues(super.el),
      'textae-editor__edit-type-dialog__ok-button'
    )

    bind(editor, typeContainer, super.el)

    // Observe edit an attributu button
    delegate(
      super.el,
      '.textae-editor__edit-type-dialog__attribute__edit__value',
      'click',
      (e) => {
        super.close()
        const pred = e.target.dataset.predicate
        const attrDef = typeContainer.findAttribute(pred)
        editor.eventEmitter.emit(
          'textae.entityPallet.attribute.object.edit',
          attrDef
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
      typeContainer.findByLabel(term)
    )
  }
}
