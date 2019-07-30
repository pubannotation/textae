import EditorDialog from '../dialog/EditorDialog'

export default function(id, title, html) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  const $dialog = new EditorDialog(null, id, title, wrapper.firstChild)

  $dialog.on('dialog.close', $dialog.close)

  return $dialog
}
