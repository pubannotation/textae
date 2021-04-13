import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'

export default function ({ targetX, targetY }, targetEndpoint, annotationBox) {
  const targetLine = document.createElementNS(NS.SVG, 'polyline')
  const centerOfTarget =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
  targetLine.setAttribute(
    'points',
    `${targetX} ${targetY + MarkerHeight}, ${centerOfTarget} ${
      targetY + MarkerHeight
    }, ${centerOfTarget} ${targetEndpoint.top - annotationBox.top}`
  )
  targetLine.setAttribute('style', `${BaseColorStroke}; fill: none;`)

  return targetLine
}
