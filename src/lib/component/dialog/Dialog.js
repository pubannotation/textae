import extendDialog from './extendDialog'
import $ from 'jquery'
global.jQuery = require('jquery')
require('jq-ui')

export default function(openOption, id, title, $content) {
  openOption = Object.assign(
    {
      resizable: false,
      modal: true,
      dialogClass: 'textae-editor--dialog'
    },
    openOption
  )

  const $dialog = new Dialog(id, title, $content)

  $dialog.on('dialogclose', () => {
    // Delay destroy to check a click target is child of the dialog.
    requestAnimationFrame(() => $dialog.dialog('destroy'))
  })
  return extendDialog(openOption, $dialog)
}

function Dialog(id, title, content) {
  const el = document.createElement('div')
  el.id = id
  el.title = title
  el.appendChild(content)

  return $(el)
}
