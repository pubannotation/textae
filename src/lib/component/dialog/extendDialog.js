global.jQuery = require("jquery")
require("jq-ui")

export default function(openOption, $dialog) {
  return Object.assign(
    $dialog,
    new OpenCloseMixin($dialog, openOption)
  )
}

function OpenCloseMixin($dialog, openOption) {
  return {
    open() {
      $dialog.dialog(openOption)
    },
    close() {
      $dialog.dialog('close')
    },
  }
}
