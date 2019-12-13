import dohtml from 'dohtml'
import EditorDialog from '../dialog/EditorDialog'
import template from './template'
import observeEnterKeyPress from './observeEnterKeyPress'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

export default class {
  constructor(title, content, typeDefinition, autocompletionWs, done) {
    const el = dohtml.create(template(content))
    const okHandler = () => {
      const inputs = el.querySelectorAll('input')
      done(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].checked)
      $dialog.close()
    }

    // Create a dialog
    const $dialog = new EditorDialog('textae.dialog.edit-type', title, el, {
      noCancelButton: true,
      buttons: {
        OK: okHandler
      },
      height: 250
    })

    observeEnterKeyPress(el, okHandler)
    setSourceOfAutoComplete($dialog, typeDefinition, autocompletionWs)

    $dialog.open()
  }
}
