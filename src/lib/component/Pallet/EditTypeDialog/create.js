import delegate from 'delegate'
import EditorDialog from '../../dialog/EditorDialog'
import CLASS_NAMES from './className'

export default function(editor, el, inputs, title) {
  const okHandler = () => {
      $dialog.done(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].checked)
      $dialog.close()
    },
    // Create a dialog
    $dialog = new EditorDialog(
      editor.editorId,
      'textae.dialog.edit-type',
      title,
      el,
      {
        noCancelButton: true,
        buttons: {
          OK: okHandler
        },
        height: 250
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
