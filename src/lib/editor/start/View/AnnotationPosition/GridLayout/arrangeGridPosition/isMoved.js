export default function(oldPosition, newPosition) {
  if (
    !oldPosition ||
    oldPosition.top !== newPosition.top ||
    oldPosition.left !== newPosition.left
  ) {
    return true
  }
  return false
}
