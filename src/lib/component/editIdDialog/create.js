import delegate from 'delegate'
import EditorDialog from '../dialog/EditorDialog'
import CLASS_NAME from './className'

export default function(editor, el, input, label) {
  const okHandler = () => {
      $dialog.done(input.value, label.innerText)
      $dialog.close()
    },
    // Create a dialog
    $dialog = new EditorDialog(
      editor.editorId,
      'textae.dialog.edit-id',
      'Please enter new id',
      el, {
        noCancelButton: true,
        buttons: {
          OK: okHandler
        },
        height: 200
      }
    )

  // Observe enter key press
  delegate($dialog[0], `.${CLASS_NAME}`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      okHandler()
    }
  })

  return $dialog
}
