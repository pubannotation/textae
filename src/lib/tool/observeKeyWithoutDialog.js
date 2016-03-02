// Observe key-input events and convert events to readable code.
export default function(keyInputHandler, editors) {
  let noop = () => {},
    onKeyup = keyInputHandler // Overwrite by the noop when daialogs are opened.

  editors.observeKeyInput(onKeyup)

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $('body')
    .on('dialogopen', '.ui-dialog', () => onKeyup = noop)
    .on('dialogclose', '.ui-dialog', () => onKeyup = keyInputHandler)
}
