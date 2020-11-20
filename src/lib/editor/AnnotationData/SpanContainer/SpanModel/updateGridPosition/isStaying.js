export default function (gridElement, top, left) {
  if (
    gridElement.style &&
    parseFloat(gridElement.style.top) === top &&
    parseFloat(gridElement.style.left) === left
  ) {
    return true
  }
  return false
}
