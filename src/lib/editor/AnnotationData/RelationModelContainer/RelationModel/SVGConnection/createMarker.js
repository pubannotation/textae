import { NS } from './NS'

export default function (id) {
  const marker = document.createElementNS(NS.SVG, 'marker')
  marker.setAttribute('id', id)
  marker.setAttribute('orient', 'auto')
  return marker
}
