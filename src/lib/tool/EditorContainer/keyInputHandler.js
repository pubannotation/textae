export default function(editors, e) {
  // Keyup events occurs without selected editor, When editor is focused before initializing.
  if (editors.selected) {
    if (e.key === 'h') {
      editors.openHelpDialog()
    }
  }
}
