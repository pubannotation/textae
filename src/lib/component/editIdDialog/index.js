import TEMPLATE from './template'
import create from './create'
import update from './update'

export default function(editor, currentId, typeContainer, done, autocompletionWs) {
  const el = document.createElement('div')
  el.innerHTML = TEMPLATE

  const label = el.querySelector('span'),
    input = el.querySelector('input'),
    dialog = create(editor, el, input, label)

  dialog.open()
  update(dialog, input, label, typeContainer, autocompletionWs, done, currentId)
}
