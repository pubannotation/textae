export default function (marker, weight, color) {
  marker.setAttribute('markerWidth', 12 * weight)
  marker.setAttribute('markerHeight', 12 * weight)
  marker.setAttribute('refX', 12 * weight)
  marker.setAttribute('refY', 6 * weight)

  const polygon = marker.children[0]
  polygon.setAttribute(
    'points',
    `0 0, ${12 * weight} ${6 * weight}, 0 ${12 * weight}, ${6 * weight} ${
      6 * weight
    }`
  )
  polygon.setAttribute('style', `fill: ${color}`)
}
