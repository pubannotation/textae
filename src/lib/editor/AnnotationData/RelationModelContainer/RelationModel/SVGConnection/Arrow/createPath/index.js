import { NS } from '../../NS'
import { MarkerHeight } from '../MarkerHeight'
import getXPositions from './getXPositions'

export default function (
  annotationBox,
  sourceEntity,
  targetEntity,
  color,
  isBold
) {
  const sourceEndpoint = sourceEntity.typeValuesElement.getBoundingClientRect()
  const targetEndpoint = targetEntity.typeValuesElement.getBoundingClientRect()

  const { source: sourceX, target: targetX } = getXPositions(
    isBold,
    sourceEndpoint,
    targetEndpoint,
    annotationBox
  )

  // When the source endpoint and target endpoint are close,
  // bend the target endpoint side of the relationship significantly.
  const targetContlorX =
    targetX +
    (Math.abs(targetX - sourceX) > 24 ? 0 : sourceX < targetX ? 150 : -150)

  const sourceY =
    sourceEndpoint.top - annotationBox.top - MarkerHeight - (isBold ? 3 : 0)
  const targetY =
    targetEndpoint.top - annotationBox.top - MarkerHeight - (isBold ? 3 : 0)
  const controleY =
    Math.min(sourceY, targetY) - Math.abs(targetX - sourceX) / 2 - 20

  const path = document.createElementNS(NS.SVG, 'path')

  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceX} ${controleY}, ${targetContlorX} ${controleY}, ${targetX} ${targetY}`
  )

  path.setAttribute(
    'style',
    `fill:none; stroke: ${color}; opacity: ${isBold ? 1 : 0.5}`
  )

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }

  return [
    path,
    { sourceY, targetY, controleY, sourceX, targetX, targetContlorX }
  ]
}
