import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function ({ sourceX, sourceY }, entity, annotationBox) {
  const jetty = document.createElementNS(NS.SVG, 'polyline')
  const centerOfEntity = entity.left + entity.width / 2 - annotationBox.left
  jetty.setAttribute(
    'points',
    `${sourceX} ${sourceY + MarkerHeight}, ${centerOfEntity} ${
      sourceY + MarkerHeight
    }, ${centerOfEntity} ${entity.top - annotationBox.top}`
  )

  return jetty
}
