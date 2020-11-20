import isStaying from './isStaying'

export default function (span, top, left) {
  const gridElement = span.gridElement
  if (!isStaying(gridElement, top, left)) {
    gridElement.style.top = `${top}px`
    gridElement.style.left = `${left}px`
  }
}
