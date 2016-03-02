import getMousePoint from './getMousePoint'

export default function(helpDialog, editors) {
  return (name) => {
    switch (name) {
      case 'textae.control.button.help.click':
        helpDialog()
        break
      default:
        if (editors.selected) {
          editors.selected.api.handleButtonClick(name, {
            point: getMousePoint()
          })
        }
    }
  }
}
