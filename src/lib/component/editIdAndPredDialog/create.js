import delegate from 'delegate'
import EditorDialog from '../dialog/EditorDialog'
import CLASS_NAMES from './className'

export default function(editor, el, inputId, inputPred, label) {
  const okHandler = () => {
      $dialog.done(inputId.value, inputPred.value, label.innerText)
      $dialog.close()
    },
    // Create a dialog
    $dialog = new EditorDialog(
      editor.editorId,
      'textae.dialog.edit-id',
      'Please enter new id or pred',
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
  delegate($dialog[0], `.${CLASS_NAMES}`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      okHandler()
    }
  })

  return $dialog
}
