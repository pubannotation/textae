import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'

export default function (pathPoints, targetMarkerColor) {
  const targetTriangle = document.createElementNS(NS.SVG, 'polygon')
  targetTriangle.setAttribute('points', `-4 0, 4 0, 0 ${MarkerHeight}`)
  targetTriangle.setAttribute(
    'style',
    `${BaseColorStroke}; fill:${targetMarkerColor}`
  )
  targetTriangle.setAttribute(
    'transform',
    pathPoints.transformDefinitionsForTargetTriangle
  )

  return targetTriangle
}
