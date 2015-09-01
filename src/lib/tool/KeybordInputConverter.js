import {
  EventEmitter
}
from 'events'

const controlKeyEventMap = new Map([
  [27, 'ESC'],
  [46, 'DEL'],
  [37, 'LEFT'],
  [39, 'RIGHT']
])


// Observe key-input events and convert events to readable code.
export default function(keyInputHandler) {
  let emitter = new EventEmitter(),
    eventHandler = (e) => emitter.emit('input', convertKeyEvent(getKeyCode(e))),
    noop = () => {},
    onKeyup = eventHandler // Overwrite by the noop when daialogs are opened.

  // Observe key-input
  document.addEventListener('keyup', (event) => onKeyup(event))

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $('body')
    .on('dialogopen', '.ui-dialog', () => onKeyup = noop)
    .on('dialogclose', '.ui-dialog', () => onKeyup = eventHandler)

  return emitter
}

function convertKeyEvent(keyCode) {
  if (65 <= keyCode && keyCode <= 90) {
    // From a to z, convert 'A' to 'Z'
    return String.fromCharCode(keyCode)
  } else if (controlKeyEventMap.has(keyCode)) {
    // Control keys, like ESC, DEL ...
    return controlKeyEventMap.get(keyCode)
  }
}

function getKeyCode(e) {
  return e.keyCode
}
