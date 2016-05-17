import getKeyCode from './getKeyCode'
import convertKeyEvent from './convertKeyEvent'
import getMousePoint from '../../util/getMousePoint'

export default function(helpDialog, editors) {
  return (e) => {
    let key = convertKeyEvent(getKeyCode(e))

    if (key === 'H') {
      helpDialog()
    } else {
      editors.selected.api.handleKeyInput(key, {
        point: getMousePoint(),
        shiftKey: e.shiftKey
      })
    }
  }
}
