import { NS } from '../NS'

export default function (id, isTail) {
  const marker = document.createElementNS(NS.SVG, 'marker')
  marker.setAttribute('id', id)
  marker.setAttribute('orient', isTail ? 270 : 90)

  const polygon = document.createElementNS(NS.SVG, 'polygon')
  marker.appendChild(polygon)

  return marker
}
