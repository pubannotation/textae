import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function (x, y, entity, annotationBox) {
  const jetty = document.createElementNS(NS.SVG, 'polyline')
  const entityRect = entity.typeValuesElement.getBoundingClientRect()
  const centerOfEntity =
    entityRect.left + entityRect.width / 2 - annotationBox.left
  jetty.setAttribute(
    'points',
    `${x} ${y + MarkerHeight}, ${centerOfEntity} ${
      y + MarkerHeight
    }, ${centerOfEntity} ${entityRect.top - annotationBox.top}`
  )

  return jetty
}