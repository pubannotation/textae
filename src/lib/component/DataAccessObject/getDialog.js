import EditorDialog from '../dialog/EditorDialog'

export default function(id, title, el) {
  const $dialog = new EditorDialog(null, id, title, el)

  $dialog.on('dialog.close', $dialog.close)

  return $dialog
}
