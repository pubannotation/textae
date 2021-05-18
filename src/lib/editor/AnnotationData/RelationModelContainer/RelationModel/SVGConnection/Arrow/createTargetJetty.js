import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function ({ targetX, targetY }, entity, annotationBox) {
  const jetty = document.createElementNS(NS.SVG, 'polyline')
  const centerOfEntity = entity.left + entity.width / 2 - annotationBox.left
  jetty.setAttribute(
    'points',
    `${targetX} ${targetY + MarkerHeight}, ${centerOfEntity} ${
      targetY + MarkerHeight
    }, ${centerOfEntity} ${entity.top - annotationBox.top}`
  )

  return jetty
}
