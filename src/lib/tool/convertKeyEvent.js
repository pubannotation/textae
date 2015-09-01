const controlKeyEventMap = new Map([
  [27, 'ESC'],
  [46, 'DEL'],
  [37, 'LEFT'],
  [39, 'RIGHT']
])

export default function convertKeyEvent(keyCode) {
  if (65 <= keyCode && keyCode <= 90) {
    // From a to z, convert 'A' to 'Z'
    return String.fromCharCode(keyCode)
  } else if (controlKeyEventMap.has(keyCode)) {
    // Control keys, like ESC, DEL ...
    return controlKeyEventMap.get(keyCode)
  }
}
