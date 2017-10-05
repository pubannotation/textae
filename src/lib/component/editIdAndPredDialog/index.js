import TEMPLATE from './template'
import create from './create'
import update from './update'

export default function(editor, currentId, currentPred, typeContainer, done, autocompletionWs) {
  const el = document.createElement('div')
  el.innerHTML = TEMPLATE

  const label = el.querySelector('span'),
    input = el.querySelectorAll('input'),
    inputId = input[0],
    inputPred = input[1],
    dialog = create(editor, el, inputId, inputPred, label)

  dialog.open()
  update(dialog, inputId, inputPred, label, typeContainer, autocompletionWs, done, currentId, currentPred)
}
