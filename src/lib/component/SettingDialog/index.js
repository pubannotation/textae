import EditorDialog from '../dialog/EditorDialog'
import create from './create'
import update from './update'

export default function(editor, typeContainer, displayInstance) {
  let content = create(editor, displayInstance),
    $dialog = appendToDialog(
      content, editor
    )

  return () => {
    update($dialog, editor, typeContainer, displayInstance)
    return $dialog.open()
  }
}

function appendToDialog(content, editor) {
  return new EditorDialog(
    editor.editorId,
    'textae.dialog.setting',
    'Setting',
    content, {
      noCancelButton: true
    })
}
