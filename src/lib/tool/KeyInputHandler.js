import getMousePoint from './getMousePoint'

export default function(helpDialog, editors) {
  return (key) => {
    if (key === 'H') {
      helpDialog()
    } else {
      if (editors.getSelected()) {
        editors.getSelected().api.handleKeyInput(key, {
          point: getMousePoint()
        })
      }
    }
  }
}
