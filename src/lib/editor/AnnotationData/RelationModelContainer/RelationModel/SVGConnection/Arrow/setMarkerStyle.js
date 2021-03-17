export default function (marker, weight, color, isTail) {
  marker.setAttribute('markerWidth', 12 * weight)
  marker.setAttribute('markerHeight', 12 * weight)
  marker.setAttribute('refX', isTail ? 8 * weight : 0)
  marker.setAttribute('refY', 6 * weight)

  const polygon = marker.children[0]
  polygon.setAttribute(
    'points',
    `0 0, ${8 * weight} ${6 * weight}, 0 ${12 * weight}`
  )
  polygon.setAttribute('stroke', `${color}`)
  polygon.setAttribute('fill', `${color}`)
}
