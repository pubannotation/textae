// Create a grid unless it exists.
export default function(gridRenderer, span) {
  const grid = document.querySelector(`#G${span.id}`)
  return grid || gridRenderer.render(span)
}
