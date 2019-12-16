import getMousePoint from '../util/getMousePoint'

export default function(editors, e) {
  // Keyup events occurs without selected editor, When editor is focused before initializing.
  if (!editors.selected) {
    return
  }

  if (e.key === 'h') {
    editors.openHelpDialog()
  } else {
    editors.selected.api.handleKeyInput(e.key, {
      point: getMousePoint(),
      shiftKey: e.shiftKey
    })
  }
}
