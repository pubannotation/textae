import { NS } from './NS'

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

  // Source is left, target is right.
  if (sourceX < targetX - 20) {
    // Shift only when the entity has enough width to shift the endpoint.
    if (10 < sourceEndpoint.width / 2) {
      sourceX += 10
    }
    if (10 < targetEndpoint.width / 2) {
      targetX -= 10
    }
  }

  // Target is left, source is right.
  if (targetX < sourceX - 20) {
    if (10 < sourceEndpoint.width / 2) {
      sourceX -= 10
    }
    if (10 < targetEndpoint.width / 2) {
      targetX += 10
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
