import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function (targetMarkerColor) {
  const targetTriangle = document.createElementNS(NS.SVG, 'polygon')
  targetTriangle.setAttribute('points', `-4 0, 4 0, 0 ${MarkerHeight}`)
  targetTriangle.setAttribute('style', `fill:${targetMarkerColor}`)

  return targetTriangle
}
