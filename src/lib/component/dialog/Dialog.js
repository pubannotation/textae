import extendDialog from './extendDialog'

export default function(openOption, id, title, $content) {
  openOption = Object.assign({
    resizable: false,
    modal: true
  }, openOption)

  const $dialog = new Dialog(id, title, $content)

  $dialog.on('dialogclose', () => $dialog.dialog('destroy'))
  return extendDialog(openOption, $dialog)
}

function Dialog(id, title, content) {
  const el = document.createElement('div')
  el.id = id
  el.title = title
  el.appendChild(content)

  return $(el)
}
