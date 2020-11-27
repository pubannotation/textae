import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class EditRelationDialog extends PromiseDialog {
  constructor(typeName, typeContainer, autocompletionWs) {
    super(
      'Please enter new values',
      createContentHtml({
        value: typeName,
        label: typeContainer.getLabel(typeName)
      }),
      {
        height: 250
      },
      '.textae-editor__edit-value-and-pred-dialog--value',
      () => {
        const input = super.el.querySelector(
          '.textae-editor__edit-value-and-pred-dialog--value'
        )
        const label = super.el.querySelector('span')

        return { value: input.value, label: label.innerText }
      }
    )

    // Update the source
    const value = super.el.querySelector(
      '.textae-editor__edit-value-and-pred-dialog--value'
    )
    const labelSpan = super.el.querySelector(
      '.textae-editor__edit-value-and-pred-dialog--label span'
    )
    setSourceOfAutoComplete(value, labelSpan, autocompletionWs, (term) =>
      typeContainer.findByLabel(term)
    )
  }
}
