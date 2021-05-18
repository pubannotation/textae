import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function ({ targetX, targetY }, entity, annotationBox) {
  const targetLine = document.createElementNS(NS.SVG, 'polyline')
  const centerOfTarget = entity.left + entity.width / 2 - annotationBox.left
  targetLine.setAttribute(
    'points',
    `${targetX} ${targetY + MarkerHeight}, ${centerOfTarget} ${
      targetY + MarkerHeight
    }, ${centerOfTarget} ${entity.top - annotationBox.top}`
  )

  return targetLine
}
