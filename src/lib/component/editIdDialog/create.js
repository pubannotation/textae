import delegate from 'delegate'
import GetEditorDialog from '../dialog/GetEditorDialog'
import CLASS_NAME from './className'

export default function(editor, $content, input, label) {
  const okHandler = () => {
      $dialog.done(input.value, label.innerText)
      $dialog.close()
    },
    // Create a dialog
    $dialog = new GetEditorDialog(editor)(
      'textae.dialog.edit-id',
      'Please enter new id',
      $content, {
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
