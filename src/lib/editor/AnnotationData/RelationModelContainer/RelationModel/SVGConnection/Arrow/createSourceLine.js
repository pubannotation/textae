import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function ({ sourceX, sourceY }, sourceEndpoint, annotationBox) {
  const sourceLine = document.createElementNS(NS.SVG, 'polyline')
  const centerOfSource =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  sourceLine.setAttribute(
    'points',
    `${sourceX} ${sourceY + MarkerHeight}, ${centerOfSource} ${
      sourceY + MarkerHeight
    }, ${centerOfSource} ${sourceEndpoint.top - annotationBox.top}`
  )

  return sourceLine
}
