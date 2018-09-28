import EditorDialog from '../dialog/EditorDialog'
import create from './create'
import update from './update'
import delegate from "delegate"

export default function(editor, typeContainer, displayInstance) {
  let content = create(editor, displayInstance),
    okHandler = () => {
      $dialog.close()
    },
    $dialog = appendToDialog(
      content, editor, okHandler
    )

  // Observe enter key press
  delegate($dialog[0], `.textae-editor--dialog`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      okHandler()
    }
  })

  return () => {
    update($dialog, editor, typeContainer, displayInstance)
    return $dialog.open()
  }
}

function appendToDialog(content, editor, okHandler) {
  return new EditorDialog(
    editor.editorId,
    'textae.dialog.setting',
    'Setting',
    content, {
      noCancelButton: true,
      buttons: {
        OK: okHandler
      }
    })
}
