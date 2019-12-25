import delegate from 'delegate'
import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'

export default class extends Dialog {
  constructor({ name }, done, typeDefinition, autocompletionWs) {
    const okHandler = () => {
      const input = super.el.querySelector(
        '.textae-editor__edit-value-and-pred-dialog--value'
      )
      const label = super.el.querySelector('span')

      done(input.value, label.innerText)
      super.close()
    }

    super(
      'Please enter new values',
      createContentHtml({
        value: name,
        label: typeDefinition.getLabel(name)
      }),
      {
        buttons: {
          OK: okHandler
        },
        height: 250
      }
    )

    // Observe enter key press
    delegate(
      super.el,
      '.textae-editor__edit-value-and-pred-dialog--value',
      'keyup',
      (e) => {
        if (e.keyCode === 13) {
          okHandler()
        }
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
