import { NS } from '../../NS'
import { MarkerHeight } from '../MarkerHeight'
import getControlXs from './getControlXs'
import getXPositions from './getXPositions'

export default function (
  annotationBox,
  sourceEntity,
  targetEntity,
  color,
  isBold
) {
  const path = document.createElementNS(NS.SVG, 'path')
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    targetControlX,
    controlY
  } = getPathPoints(annotationBox, sourceEntity, targetEntity, isBold)

  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceControlX} ${controlY}, ${targetControlX} ${controlY}, ${targetX} ${targetY}`
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
    {
      sourceY,
      targetY,
      controlY,
      sourceX,
      targetX,
      sourceControlX,
      targetControlX
    }
  ]
}

function getPathPoints(annotationBox, sourceEntity, targetEntity, isBold) {
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

  const { sourceControlX, targetControlX } = getControlXs(
    sourceX,
    sourceY,
    targetX,
    targetY
  )

  const controlY =
    Math.min(sourceY, targetY) -
    Math.abs(targetX - sourceX) / 2 -
    20 +
    (isBold ? 3 : 0)

  return {
    sourceY,
    targetY,
    controlY,
    sourceX,
    targetX,
    sourceControlX,
    targetControlX
  }
}
