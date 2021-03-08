import { NS } from './NS'

export default function (id) {
  const marker = document.createElementNS(NS.SVG, 'marker')
  marker.setAttribute('id', id)
  marker.setAttribute('orient', 'auto')

  const polygon = document.createElementNS(NS.SVG, 'polygon')
  marker.appendChild(polygon)

  return marker
}
