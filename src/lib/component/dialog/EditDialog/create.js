import delegate from 'delegate'
import EditorDialog from '../EditorDialog'
import CLASS_NAMES from './className'

const HTML = `
<div class="${CLASS_NAMES.inputBox}">
<label>Predicate:</label><br>
<input class="${CLASS_NAMES.predicate}">
</div>
<div class="${CLASS_NAMES.inputBox}">
<label>Value:<span></span></label><br>
<input class="${CLASS_NAMES.value}">
</div>`

export default function(editor, done) {
  const el = document.createElement('div')
  el.classList.add(CLASS_NAMES.container)
  el.innerHTML = HTML

  const label = el.querySelector('span')
  const input = el.querySelectorAll('input')
  const input1 = input[0]
  const input2 = input[1]

  const okHandler = () => {
    done(input1.value, input2.value, label.innerText)
    $dialog.close()
  }

  // Create a dialog
  const $dialog = new EditorDialog(
    editor.editorId,
    'textae.dialog.edit-id',
    'Please enter new values',
    el,
    {
      noCancelButton: true,
      buttons: {
        OK: okHandler
      },
      height: 200
    }
  )

  // Observe enter key press
  delegate($dialog[0], `.${CLASS_NAMES.value}`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      okHandler()
    }
  })

  return $dialog
}
