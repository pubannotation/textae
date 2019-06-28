// Create a grid unless it exists.
export default function(gridRenderer, spanId) {
  const grid = document.querySelector(`#G${spanId}`)
  return grid || gridRenderer.render(spanId)
}
