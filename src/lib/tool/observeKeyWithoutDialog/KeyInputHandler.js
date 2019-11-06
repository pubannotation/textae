import getMousePoint from '../../util/getMousePoint'

export default function(helpDialog, editors) {
  return (e) => {
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
}
