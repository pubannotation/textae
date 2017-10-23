import CLASS_NAMES from './className'
import create from './create'
import update from './update'

export default function(editor, currentPred, currentValue, typeContainer, done, autocompletionWs) {
  const el = document.createElement('div')
  el.classList.add(CLASS_NAMES.container)
  el.innerHTML = `
<div class="${CLASS_NAMES.inputBox}">
  <label>Predicate: <span></span></label><br>
  <input class="${CLASS_NAMES.pred}">
</div>
<div class="${CLASS_NAMES.inputBox}">
  <label>Value: <span></span></label><br>
  <input class="${CLASS_NAMES.value}">
</div>`

  const label = el.querySelector('span'),
    input = el.querySelectorAll('input'),
    inputPred = input[0],
    inputValue = input[1],
    $dialog = create(editor, el, inputPred, inputValue, label)

  $dialog.open()
  update($dialog, inputPred, inputValue, label, typeContainer, autocompletionWs, done, currentPred, currentValue)
  setFocusOnValueInput($dialog, CLASS_NAMES.value.split(' ')[2])
}

function setFocusOnValueInput($dialog, valueInputClassName) {
  $dialog.find('.' + valueInputClassName).focus().select()
}
