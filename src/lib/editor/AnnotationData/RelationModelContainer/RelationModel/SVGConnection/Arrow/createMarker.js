import { NS } from '../NS'

export default function (id, isUp) {
  const marker = document.createElementNS(NS.SVG, 'marker')
  marker.setAttribute('id', id)
  marker.setAttribute('orient', isUp ? 90 : 270)

  const polygon = document.createElementNS(NS.SVG, 'polygon')
  marker.appendChild(polygon)

  return marker
}
