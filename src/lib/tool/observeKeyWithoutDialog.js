import getKeyCode from './getKeyCode'

// Observe key-input events and convert events to readable code.
export default function(keyInputHandler) {
  let eventHandler = (e) => keyInputHandler(getKeyCode(e)),
    noop = () => {},
    onKeyup = eventHandler // Overwrite by the noop when daialogs are opened.

  // Observe key-input
  document.addEventListener('keyup', (event) => onKeyup(event))

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $('body')
    .on('dialogopen', '.ui-dialog', () => onKeyup = noop)
    .on('dialogclose', '.ui-dialog', () => onKeyup = eventHandler)
}
