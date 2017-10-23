import delegate from 'delegate'
import EditorDialog from '../EditorDialog'
import CLASS_NAMES from './className'

export default function(editor, el, input1, input2, label) {
  const okHandler = () => {
      $dialog.done(input1.value, input2.value, label.innerText)
      $dialog.close()
    },
    // Create a dialog
    $dialog = new EditorDialog(
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
  delegate($dialog[0], `.${CLASS_NAMES.id}`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      okHandler()
    }
  })

  return $dialog
}
