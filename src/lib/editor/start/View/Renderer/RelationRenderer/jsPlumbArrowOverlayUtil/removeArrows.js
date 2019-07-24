import removeArrow from './removeArrow'

export default function removeArrows(connect, arrows) {
  arrows.forEach((id) => removeArrow(id, connect))
  return arrows
}
