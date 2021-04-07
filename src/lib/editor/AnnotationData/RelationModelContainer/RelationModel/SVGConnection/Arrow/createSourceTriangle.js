import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'

export default function (sourceX, sourceY, sourceMarkerColor) {
  const sourceTriangle = document.createElementNS(NS.SVG, 'polygon')
  sourceTriangle.setAttribute(
    'points',
    `-4 ${MarkerHeight}, 4 ${MarkerHeight}, 0 0`
  )
  sourceTriangle.setAttribute(
    'style',
    `${BaseColorStroke}; fill:${sourceMarkerColor}`
  )
  sourceTriangle.setAttribute('transform', `translate(${sourceX}, ${sourceY})`)

  return sourceTriangle
}
