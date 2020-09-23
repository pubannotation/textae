export default function(span, newPosition) {
  const grid = span.gridElement

  if (grid) {
    grid.style.top = `${newPosition.top}px`
    grid.style.left = `${newPosition.left}px`
  }
}
