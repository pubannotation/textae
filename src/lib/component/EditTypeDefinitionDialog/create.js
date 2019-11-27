import delegate from 'delegate'
import EditorDialog from '../dialog/EditorDialog'

export default function(el, inputs, title) {
  const okHandler = () => {
    $dialog.done(
      inputs[0].value,
      inputs[1].value,
      inputs[2].value,
      inputs[3].checked
    )
    $dialog.close()
  }
  // Create a dialog
  const $dialog = new EditorDialog('textae.dialog.edit-type', title, el, {
    noCancelButton: true,
    buttons: {
      OK: okHandler
    },
    height: 250
  })

  // Observe enter key press
  delegate(
    $dialog[0],
    `.textae-editor__edit-type-definition-dialog--id`,
    'keyup',
    (e) => {
      if (e.keyCode === 13) {
        okHandler()
      }
    }
  )

  return $dialog
}
