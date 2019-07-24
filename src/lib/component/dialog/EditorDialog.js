import Dialog from './Dialog'
import $ from 'jquery'

// height: 220
const defaultOption = {
  width: 550
}

export default function(editorId, id, title, el, option) {
  const openOption = getOption(option)
  const $dialog = new Dialog(openOption, id, title, el)

  return $dialog
}

function getOption(option) {
  const newOpiton = Object.assign({}, defaultOption, option)

  if (!newOpiton.noCancelButton) {
    newOpiton.buttons = Object.assign({}, newOpiton.buttons, {
      Cancel() {
        $(this).dialog('close')
      }
    })
  }

  return newOpiton
}
