import getMousePoint from './getMousePoint'

export default function(helpDialog, editors) {
  return (name) => {
    switch (name) {
      case 'textae.control.button.help.click':
        helpDialog()
        break
      default:
        if (editors.getSelected()) {
          editors.getSelected().api.handleButtonClick(name, {
            point: getMousePoint()
          })
        }
    }
  }
}
