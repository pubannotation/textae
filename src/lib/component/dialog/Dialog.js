import extendDialog from './extendDialog'

export default function(openOption, id, title, $content) {
  openOption = Object.assign({
    resizable: false,
    modal: true
  }, openOption)

  return extendDialog(openOption, new Dialog(id, title, $content))
}

function Dialog(id, title, content) {
  const el = document.createElement('div')
  el.id = id
  el.title = title
  el.appendChild(content)

  return $(el)
}
