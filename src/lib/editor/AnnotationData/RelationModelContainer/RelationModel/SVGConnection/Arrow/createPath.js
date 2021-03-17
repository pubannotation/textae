import { NS } from '../NS'

const DistanceToShift = 8
const MinimumDistance = DistanceToShift * 3

export default function (
  sourceEndpoint,
  annotationBox,
  targetEndpoint,
  color,
  head,
  tail,
  downTail,
  isBold
) {
  let sourceX =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  let targetX =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left

  const markerSize = 8
  let sourceY = sourceEndpoint.top - annotationBox.top - markerSize
  const targetY = targetEndpoint.top - annotationBox.top - markerSize

  const path = document.createElementNS(NS.SVG, 'path')

  path.setAttribute('marker-start', `url(#${tail.id})`)

  // When the source and target are close, don't shift them.
  if (sourceX < targetX - MinimumDistance) {
    // Shift only when the entity has enough width to shift the endpoint.
    if (isBold || MinimumDistance <= sourceEndpoint.width / 2) {
      sourceX += DistanceToShift * 3
    }
    if (isBold || MinimumDistance <= targetEndpoint.width / 2) {
      targetX -= DistanceToShift * 3
    }
  } else if (targetX < sourceX - MinimumDistance) {
    if (isBold || MinimumDistance <= sourceEndpoint.width / 2) {
      sourceX -= DistanceToShift
    }
    if (isBold || MinimumDistance <= targetEndpoint.width / 2) {
      targetX += DistanceToShift
    }
  } else {
    if (sourceY < targetY) {
      sourceY =
        sourceEndpoint.top +
        sourceEndpoint.height -
        annotationBox.top +
        markerSize
      path.setAttribute('marker-start', `url(#${downTail.id})`)
    }
  }

  const controleY =
    Math.min(sourceY, targetY) - Math.abs(targetX - sourceX) / 2 + 10
  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceX} ${controleY}, ${targetX} ${controleY}, ${targetX} ${targetY}`
  )

  path.setAttribute('style', `fill:none; stroke: ${color};`)
  path.setAttribute('marker-end', `url(#${head.id})`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }
  return path
}
