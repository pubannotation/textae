import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getValues from './getValues'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'
import toEntityHTML from './toEntityHTML'
import observeRemoveAttributeButton from './observeRemoveAttributeButton'
import toAttributeHTML from './toAttributeHTML'

export default class EditEntityDialog extends PromiseDialog {
  constructor(
    editor,
    entityContainer,
    attributeContainer,
    autocompletionWs,
    typeValues
  ) {
    const { typeName, attributes } = typeValues
    const contentHtml = `
      <table>
        <thead>
          <tr>
            <th>Predicate</th>
            <th>Value</th>
            <th>Label</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${toEntityHTML(typeName, entityContainer)}
        </tbody>
      </table>
      ${attributes.map((a) => toAttributeHTML(a, attributeContainer)).join('')}
      `

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
