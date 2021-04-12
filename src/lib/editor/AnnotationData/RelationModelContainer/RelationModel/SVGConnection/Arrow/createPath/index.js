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
  const { source: sourceX, target: targetX } = getXPositions(
    isBold,
    sourceEntity,
    targetEntity,
    annotationBox
  )

  const sourceY =
    sourceEntity.typeValuesElement.getBoundingClientRect().top -
    annotationBox.top -
    MarkerHeight -
    (isBold ? 3 : 0)

  const targetY =
    targetEntity.typeValuesElement.getBoundingClientRect().top -
    annotationBox.top -
    MarkerHeight -
    (isBold ? 3 : 0)

  // When the source endpoint and target endpoint are close,
  // bend the target endpoint side of the relationship significantly.
  const targetControlX =
    targetX +
    (targetY === sourceY || Math.abs(targetX - sourceX) > 42
      ? 0
      : sourceX <= targetX + 16
      ? 150
      : -150)

  const controleY =
    Math.min(sourceY, targetY) - Math.abs(targetX - sourceX) / 2 - 20

  const path = document.createElementNS(NS.SVG, 'path')

  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceX} ${controleY}, ${targetControlX} ${controleY}, ${targetX} ${targetY}`
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
    { sourceY, targetY, controleY, sourceX, targetX, targetControlX }
  ]
}
