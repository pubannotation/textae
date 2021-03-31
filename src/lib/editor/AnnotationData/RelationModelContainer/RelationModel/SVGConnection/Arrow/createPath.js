import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

const DistanceToShift = 8
const MinimumDistance = DistanceToShift * 3
export default function (
  sourceEndpoint,
  annotationBox,
  targetEndpoint,
  color,
  head,
  tail,
  isBold
) {
  const centerOfSourceEntity =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const centerOfTargetEntity =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left

  const { source: sourceX, target: targetX } = getXPositions(
    centerOfSourceEntity,
    centerOfTargetEntity,
    isBold,
    sourceEndpoint,
    targetEndpoint
  )

  const sourceY = sourceEndpoint.top - annotationBox.top - MarkerHeight
  const targetY = targetEndpoint.top - annotationBox.top - MarkerHeight
  const controleY =
    Math.min(sourceY, targetY) - Math.abs(targetX - sourceX) / 2 - 20

  const path = document.createElementNS(NS.SVG, 'path')
  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceX} ${controleY}, ${targetX} ${controleY}, ${targetX} ${targetY}`
  )

  path.setAttribute('style', `fill:none; stroke: ${color};`)
  path.setAttribute('marker-start', `url(#${tail.id})`)
  path.setAttribute('marker-end', `url(#${head.id})`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }

  return [path, { sourceY, targetY, controleY, sourceX, targetX }]
}

function getXPositions(
  centerOfSourceEntity,
  centerOfTargetEntity,
  isBold,
  sourceEndpoint,
  targetEndpoint
) {
  // Shift only when the entity has enough width to shift the endpoint.
  const leftTarget =
    isBold || MinimumDistance <= targetEndpoint.width / 2
      ? centerOfTargetEntity - DistanceToShift * 3
      : centerOfTargetEntity
  const leftSource =
    isBold || MinimumDistance <= sourceEndpoint.width / 2
      ? centerOfSourceEntity - DistanceToShift
      : centerOfSourceEntity
  const rightTarget =
    isBold || MinimumDistance <= targetEndpoint.width / 2
      ? centerOfTargetEntity + DistanceToShift
      : centerOfTargetEntity
  const rightSource =
    isBold || MinimumDistance <= sourceEndpoint.width / 2
      ? centerOfSourceEntity + DistanceToShift * 3
      : centerOfSourceEntity

  // When the source and target are close, don't shift them.
  if (rightSource < leftTarget) {
    return {
      source: rightSource,
      target: leftTarget
    }
  } else if (rightTarget < leftSource) {
    return {
      source: leftSource,
      target: rightTarget
    }
  } else {
    return { source: centerOfSourceEntity, target: centerOfTargetEntity }
  }
}
