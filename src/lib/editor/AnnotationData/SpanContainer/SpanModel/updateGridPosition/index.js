import isStaying from './isStaying'

export default function (gridElement, top, left) {
  if (!isStaying(gridElement, top, left)) {
    gridElement.style.top = `${top}px`
    gridElement.style.left = `${left}px`
  }
}
