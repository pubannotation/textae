import EditorDialog from '../dialog/EditorDialog'

export default function(content, editor, okHandler) {
  return new EditorDialog(
    editor.editorId,
    'textae.dialog.setting',
    'Setting',
    content,
    {
      noCancelButton: true,
      buttons: {
        OK: okHandler
      }
    }
  )
}
