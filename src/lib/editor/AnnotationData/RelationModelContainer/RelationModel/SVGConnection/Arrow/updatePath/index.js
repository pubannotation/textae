import { MarkerHeight } from '../MarkerHeight'
import getControlXs from './getControlXs'
import getXPositions from './getXPositions'

export default function (
  path,
  annotationBox,
  sourceEntity,
  targetEntity,
  color,
  isBold
) {
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

  path.setAttribute('style', `stroke: ${color};`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }

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
