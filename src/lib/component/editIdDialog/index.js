import TEMPLATE from './template'
import create from './create'
import update from './update'

const el = document.createElement('div')
el.innerHTML = TEMPLATE

const label = el.querySelector('span'),
  input = el.querySelector('input')

// The dialog is shared in all editor.
let dialog

export default function(editor, currentId, typeContainer, done, autocompletionWs) {
  if (!dialog) {
    dialog = create(editor, el, input, label)
  }

  dialog.open()
  update(dialog, input, label, typeContainer, autocompletionWs, done, currentId)
}
