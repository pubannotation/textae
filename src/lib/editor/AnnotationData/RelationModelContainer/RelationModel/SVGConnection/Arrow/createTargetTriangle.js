import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'

export default function (targetX, targetY, targetMarkerColor) {
  const targetTriangle = document.createElementNS(NS.SVG, 'polygon')
  targetTriangle.setAttribute('points', `-6 0, 6 0, 0 ${MarkerHeight}`)
  targetTriangle.setAttribute(
    'style',
    `${BaseColorStroke}; fill:${targetMarkerColor}`
  )
  targetTriangle.setAttribute('transform', `translate(${targetX}, ${targetY})`)

  return targetTriangle
}
