import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class extends PromiseDialog {
  constructor({ name }, typeDefinition, autocompletionWs) {
    super(
      'Please enter new values',
      createContentHtml({
        value: name,
        label: typeDefinition.getLabel(name)
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
    setSourceOfAutoComplete(typeDefinition, autocompletionWs, value, labelSpan)
  }
}
