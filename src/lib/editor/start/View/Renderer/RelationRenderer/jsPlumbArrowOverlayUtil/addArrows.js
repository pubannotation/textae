import addArrow from './addArrow'

export default function(connect, arrows) {
  arrows.forEach((id) => addArrow(id, connect))
  return arrows
}
