import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'

export default function (pathPoints, sourceMarkerColor) {
  const sourceTriangle = document.createElementNS(NS.SVG, 'polygon')
  sourceTriangle.setAttribute(
    'points',
    `-4 ${MarkerHeight}, 4 ${MarkerHeight}, 0 0`
  )
  sourceTriangle.setAttribute(
    'style',
    `${BaseColorStroke}; fill:${sourceMarkerColor}`
  )
  sourceTriangle.setAttribute(
    'transform',
    pathPoints.transformDefinitionsForSourceTriangle
  )

  return sourceTriangle
}
