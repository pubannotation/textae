import EditorDialog from '../dialog/EditorDialog'

module.exports = function(id, title, el, editor) {
  const $dialog = new EditorDialog(editor.editorId, id, title, el)

  $dialog.on('dialog.close', $dialog.close)

  return $dialog
}
