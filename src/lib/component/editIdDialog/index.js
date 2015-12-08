import TEMPLATE from './template'
import create from './create'
import update from './update'

const $content = $(TEMPLATE),
  label = $content[0].querySelector('span'),
  input = $content[2].querySelector('input')

// The dialog is shared in all editor.
let dialog

export default function(editor, currentId, typeContainer, done, autocompletionWs) {
  if (!dialog) {
    dialog = create(editor, $content, input, label)
  }

  update(dialog, input, label, typeContainer, autocompletionWs, done, currentId)
  dialog.open()
}
