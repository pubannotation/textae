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

  // When the source and target are close, don't shift them.
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
  if (centerOfSourceEntity < centerOfTargetEntity - MinimumDistance) {
    const ret = {}

    // Shift only when the entity has enough width to shift the endpoint.
    if (isBold || MinimumDistance <= sourceEndpoint.width / 2) {
      ret.source = centerOfSourceEntity + DistanceToShift * 3
    } else {
      ret.source = centerOfSourceEntity
    }

    if (isBold || MinimumDistance <= targetEndpoint.width / 2) {
      ret.target = centerOfTargetEntity - DistanceToShift * 3
    } else {
      ret.target = centerOfTargetEntity
    }

    return ret
  } else if (centerOfTargetEntity < centerOfSourceEntity - MinimumDistance) {
    const ret = {}

    if (isBold || MinimumDistance <= sourceEndpoint.width / 2) {
      ret.source = centerOfSourceEntity - DistanceToShift
    } else {
      ret.source = centerOfSourceEntity
    }

    if (isBold || MinimumDistance <= targetEndpoint.width / 2) {
      ret.target = centerOfTargetEntity + DistanceToShift
    } else {
      ret.target = centerOfTargetEntity
    }

    return ret
  } else {
    return { source: centerOfSourceEntity, target: centerOfTargetEntity }
  }
}
