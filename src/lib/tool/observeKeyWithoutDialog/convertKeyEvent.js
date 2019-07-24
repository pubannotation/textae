const controlKeyEventMap = new Map([
  [27, 'ESC'],
  [37, 'LEFT'],
  [38, 'UP'],
  [39, 'RIGHT'],
  [40, 'DOWN'],
  [46, 'DEL']
])

export default function(keyCode) {
  if (65 <= keyCode && keyCode <= 90) {
    // From a to z, convert 'A' to 'Z'
    return String.fromCharCode(keyCode)
  } else if (controlKeyEventMap.has(keyCode)) {
    // Control keys, like ESC, DEL ...
    return controlKeyEventMap.get(keyCode)
  }

  return null
}
