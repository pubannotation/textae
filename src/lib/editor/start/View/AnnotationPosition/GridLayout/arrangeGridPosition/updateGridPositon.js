import getGridOfSpan from '../getGridOfSpan'

export default function(span, newPosition) {
  const grid = getGridOfSpan(span.id)

  if (grid) {
    grid.style.top = `${newPosition.top}px`
    grid.style.left = `${newPosition.left}px`
  }
}
