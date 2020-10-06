export default function(gridElement, newPosition) {
  if (
    !gridElement.style ||
    parseFloat(gridElement.style.top) !== newPosition.top ||
    parseFloat(gridElement.style.left) !== newPosition.left
  ) {
    return true
  }
  return false
}
