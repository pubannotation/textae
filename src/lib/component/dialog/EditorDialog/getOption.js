import $ from 'jquery'

const defaultOption = {
  width: 550
}

export default function(option) {
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
