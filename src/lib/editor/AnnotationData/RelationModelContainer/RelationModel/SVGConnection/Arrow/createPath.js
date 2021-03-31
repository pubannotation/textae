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

  let sourceX = centerOfSourceEntity
  let targetX = centerOfTargetEntity

  // When the source and target are close, don't shift them.
  if (centerOfSourceEntity < centerOfTargetEntity - MinimumDistance) {
    // Shift only when the entity has enough width to shift the endpoint.
    if (isBold || MinimumDistance <= sourceEndpoint.width / 2) {
      sourceX += DistanceToShift * 3
    }
    if (isBold || MinimumDistance <= targetEndpoint.width / 2) {
      targetX -= DistanceToShift * 3
    }
  } else if (centerOfTargetEntity < centerOfSourceEntity - MinimumDistance) {
    if (isBold || MinimumDistance <= sourceEndpoint.width / 2) {
      sourceX -= DistanceToShift
    }
    if (isBold || MinimumDistance <= targetEndpoint.width / 2) {
      targetX += DistanceToShift
    }
  }

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
