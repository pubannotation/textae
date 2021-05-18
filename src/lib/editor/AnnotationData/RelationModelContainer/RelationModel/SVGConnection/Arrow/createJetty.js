import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function (x, y, entity) {
  const jetty = document.createElementNS(NS.SVG, 'polyline')

  jetty.setAttribute(
    'points',
    `${x} ${y + MarkerHeight}, ${entity.center} ${y + MarkerHeight}, ${
      entity.center
    } ${entity.top}`
  )

  return jetty
}
