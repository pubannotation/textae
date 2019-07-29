import Handlebars from 'handlebars'
import delegate from 'delegate'
import EditorDialog from '../EditorDialog'

const source = `
<div class="textae-editor__edit-value-and-pred-dialog__container">
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Predicate:</label><br>
    <input class="textae-editor__edit-value-and-pred-dialog--predicate" value="{{predicate}}">
  </div>
  <div class="textae-editor__edit-value-and-pred-dialog__input-box">
    <label>Value:<span></span></label><br>
    <input class="textae-editor__edit-value-and-pred-dialog--value" value="{{value}}">
  </div>
</div>`
const template = Handlebars.compile(source)

export default function(editor, predicate, value, done) {
  const el = document.createElement('div')
  el.innerHTML = template({ predicate, value })

  // Use `this` according to the jQuery style.
  const okHandler = function() {
    const label = this.querySelector('span')
    const input = this.querySelectorAll('input')
    const input1 = input[0]
    const input2 = input[1]

    done(input1.value, input2.value, label.innerText)
    $dialog.close()
  }

  // Create a dialog
  const $dialog = new EditorDialog(
    editor.editorId,
    'textae.dialog.edit-id',
    'Please enter new values',
    el.children[0],
    {
      noCancelButton: true,
      buttons: {
        OK: okHandler
      },
      height: 200
    }
  )

  // Observe enter key press
  delegate(
    $dialog[0],
    '.textae-editor__edit-value-and-pred-dialog--value',
    'keyup',
    (e) => {
      if (e.keyCode === 13) {
        okHandler.call($dialog[0])
      }
    }
  )

  return $dialog
}
