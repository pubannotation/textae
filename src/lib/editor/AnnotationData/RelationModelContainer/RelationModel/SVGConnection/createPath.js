import { NS } from './NS'

const MinimumDistance = 20
const DistanceToShift = 10

export default function (
  sourceEndpoint,
  annotationBox,
  targetEndpoint,
  color,
  arrow,
  isBold
) {
  const path = document.createElementNS(NS.SVG, 'path')
  let sourceX =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const sourceY = sourceEndpoint.top - annotationBox.top
  let targetX =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
  const targetY = targetEndpoint.top - annotationBox.top

  // When the source and target are close, don't shift them.
  if (sourceX < targetX - MinimumDistance) {
    // Shift only when the entity has enough width to shift the endpoint.
    if (DistanceToShift < sourceEndpoint.width / 2) {
      sourceX += DistanceToShift
    }
    if (DistanceToShift < targetEndpoint.width / 2) {
      targetX -= DistanceToShift
    }
  }

  if (targetX < sourceX - MinimumDistance) {
    if (DistanceToShift < sourceEndpoint.width / 2) {
      sourceX -= DistanceToShift
    }
    if (DistanceToShift < targetEndpoint.width / 2) {
      targetX += DistanceToShift
    }
  }

  const controleY =
    Math.min(sourceY, targetY) - Math.abs(targetX - sourceX) / 6 - 10
  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceX} ${controleY}, ${targetX} ${controleY}, ${targetX} ${targetY}`
  )

  path.setAttribute('style', `fill:none; stroke: ${color};`)
  path.setAttribute('marker-end', `url(#${arrow.id})`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }
  return path
}
