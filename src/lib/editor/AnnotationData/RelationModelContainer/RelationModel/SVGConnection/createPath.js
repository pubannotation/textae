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
  const x1 = sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const y1 = sourceEndpoint.top - annotationBox.top
  const x2 = targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
  const y2 = targetEndpoint.top - annotationBox.top
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
