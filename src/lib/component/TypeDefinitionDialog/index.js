import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import observeEnterKeyPress from './observeEnterKeyPress'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

export default class extends Dialog {
  constructor(title, content, typeDefinition, autocompletionWs, done) {
    const okHandler = () => {
      const inputs = super.el.querySelectorAll('input')
      done(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].checked)
    }

    super(
      title,
      createContentHtml(content),
      { label: 'OK', handler: okHandler },
      {
        height: 250
      }
    )

    observeEnterKeyPress(super.el, okHandler)
    setSourceOfAutoComplete(super.el, typeDefinition, autocompletionWs)
  }
}
