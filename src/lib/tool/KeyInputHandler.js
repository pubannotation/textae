import getKeyCode from './getKeyCode'
import convertKeyEvent from './convertKeyEvent'
import getMousePoint from './getMousePoint'

export default function(helpDialog, editors) {
  return (e) => {
    let key = convertKeyEvent(getKeyCode(e))

    if (key === 'H') {
      helpDialog()
    } else {
      if (editors.getSelected()) {
        editors.getSelected().api.handleKeyInput(key, {
          point: getMousePoint(),
          shiftKey: e.shiftKey
        })
      }
    }
  }
}
