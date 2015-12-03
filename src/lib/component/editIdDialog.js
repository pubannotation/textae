import delegate from 'delegate'
import GetEditorDialog from './dialog/GetEditorDialog'

const CLASS_NAME = 'textae-editor__edit-id-dialog__id',
  TEMPLATE = `
<div>
  <input type="text" class="${CLASS_NAME}"></input>
</div>`

export default function(editor, currentId, done = () => {}) {
  // Create a dialog
  const $content = $(TEMPLATE),
    $dialog = new GetEditorDialog(editor)(
      'textae.dialog.edit-id',
      'Please enter new id',
      $content, {
        noCancelButton: true,
        buttons: {
          OK: () => {
            const newId = $content[0].querySelector('input').value

            done(newId)
            $dialog.close()
          }
        },
        height: 170
      }
    )

  // Update display value
  $dialog[0].querySelector(`.${CLASS_NAME}`).value = currentId

  // Observe enter key press
  delegate($dialog[0], `.${CLASS_NAME}`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      done(e.delegateTarget.value)
      $dialog.close()
    }
  })

  // Open dialog
  $dialog.open()
}
