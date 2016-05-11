import getMousePoint from '../util/getMousePoint'

export default function(editor, helpDialog) {
  return (name) => {
    switch (name) {
      case 'textae.control.button.help.click':
        helpDialog()
        break
      default:
        editor.api.handleButtonClick(name, {
          point: getMousePoint()
        })
    }
  }
}
