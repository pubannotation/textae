import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function (sourceMarkerColor) {
  const sourceTriangle = document.createElementNS(NS.SVG, 'polygon')
  sourceTriangle.setAttribute(
    'points',
    `-4 ${MarkerHeight}, 4 ${MarkerHeight}, 0 0`
  )
  sourceTriangle.setAttribute('style', `fill:${sourceMarkerColor}`)

  return sourceTriangle
}
