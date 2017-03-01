import Dialog from './Dialog'
import $ from 'jquery'

const defaultOption = {
  width: 550,
  height: 220
}

export default function(editorId, id, title, el, option) {
  const openOption = getOption(option),
    $dialog = new Dialog(
      openOption,
      id,
      title,
      el
    )

  return $dialog
}

function getOption(option) {
  const newOpiton = Object.assign({}, defaultOption, option)

  if (!newOpiton.noCancelButton) {
    newOpiton.buttons = Object.assign({}, newOpiton.buttons, {
      Cancel: function() {
        $(this).dialog('close')
      }
    })
  }

  return newOpiton
}
