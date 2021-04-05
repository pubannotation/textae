import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'

export default function (sourceX, sourceY, sourceEndpoint, annotationBox) {
  const sourceLine = document.createElementNS(NS.SVG, 'polyline')
  const centerOfSource =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  sourceLine.setAttribute(
    'points',
    `${sourceX} ${sourceY + MarkerHeight}, ${centerOfSource} ${
      sourceY + MarkerHeight
    }, ${centerOfSource} ${sourceEndpoint.top - annotationBox.top}`
  )
  sourceLine.setAttribute('style', `${BaseColorStroke}; fill: none;`)

  return sourceLine
}
