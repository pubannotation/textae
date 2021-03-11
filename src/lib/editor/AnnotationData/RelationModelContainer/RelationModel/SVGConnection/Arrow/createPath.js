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
  isBold
) {
  const path = document.createElementNS(NS.SVG, 'path')
  let sourceX =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const sourceY = sourceEndpoint.top - annotationBox.top - (isBold ? 18 : 12)
  let targetX =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
  const targetY = targetEndpoint.top - annotationBox.top - (isBold ? 18 : 12)

  // When the source and target are close, don't shift them.
  if (sourceX < targetX - MinimumDistance) {
    // Shift only when the entity has enough width to shift the endpoint.
    if (MinimumDistance <= sourceEndpoint.width / 2) {
      sourceX += DistanceToShift * 3
    }
    if (MinimumDistance <= targetEndpoint.width / 2) {
      targetX -= DistanceToShift * 3
    }
  }

  if (targetX < sourceX - MinimumDistance) {
    if (MinimumDistance <= sourceEndpoint.width / 2) {
      sourceX -= DistanceToShift
    }
    if (MinimumDistance <= targetEndpoint.width / 2) {
      targetX += DistanceToShift
    }
  }

  const controleY =
    Math.min(sourceY, targetY) - Math.abs(targetX - sourceX) / 2 + 10
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
  return path
}
