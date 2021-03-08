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
  let x1 = sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const y1 = sourceEndpoint.top - annotationBox.top
  let x2 = targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
  const y2 = targetEndpoint.top - annotationBox.top

  // Source is left, target is right.
  if (20 < x2 - x1) {
    // Shift only when the entity has enough width to shift the endpoint.
    if (10 < sourceEndpoint.width / 2) {
      x1 += 10
    }
    if (10 < targetEndpoint.width / 2) {
      x2 -= 10
    }
  }

  // Target is left, source is right.
  if (20 < x1 - x2) {
    if (10 < sourceEndpoint.width / 2) {
      x1 -= 10
    }
    if (10 < targetEndpoint.width / 2) {
      x2 += 10
    }
  }

  const controleY = Math.min(y1, y2) - Math.abs(x2 - x1) / 6 - 10
  path.setAttribute(
    'd',
    `M ${x1}, ${y1} C ${x1} ${controleY}, ${x2} ${controleY}, ${x2} ${y2}`
  )

  path.setAttribute('style', `fill:none; stroke: ${color};`)
  path.setAttribute('marker-end', `url(#${arrow.id})`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }
  return path
}
