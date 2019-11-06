import HelpDialog from '../component/HelpDialog'
import getMousePoint from '../util/getMousePoint'

const helpDialog = new HelpDialog()

export default function(editors, e) {
  // Keyup events occurs without selected editor, When editor is focused before initializing.
  if (!editors.selected) {
    return
  }

  if (e.key === 'h') {
    helpDialog()
  } else {
    editors.selected.api.handleKeyInput(e.key, {
      point: getMousePoint(),
      shiftKey: e.shiftKey
    })
  }
}
