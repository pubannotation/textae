import Dialog from './Dialog'

const defaultOption = {
  width: 550,
  height: 220
}

export default function(editorId, id, title, $content, option) {
  const openOption = getOption(option),
    $dialog = new Dialog(
      openOption,
      getDialogId(editorId, id),
      title,
      $content
    )

  return Object.assign($dialog, {
    id: getDialogId(editorId, id)
  })
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

function getDialogId(editorId, id) {
  return `${editorId}.${id}`
}
