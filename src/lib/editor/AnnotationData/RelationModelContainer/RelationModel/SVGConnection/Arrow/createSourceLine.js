import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function ({ sourceX, sourceY }, entity, annotationBox) {
  const sourceLine = document.createElementNS(NS.SVG, 'polyline')
  const centerOfSource = entity.left + entity.width / 2 - annotationBox.left
  sourceLine.setAttribute(
    'points',
    `${sourceX} ${sourceY + MarkerHeight}, ${centerOfSource} ${
      sourceY + MarkerHeight
    }, ${centerOfSource} ${entity.top - annotationBox.top}`
  )

  return sourceLine
}
