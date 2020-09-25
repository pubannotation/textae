export default function(span) {
  const grid = span.gridElement

  if (grid.classList.contains('hidden')) {
    grid.classList.remove('hidden')
  }
}
