export default function showInvisibleGrid(span) {
  const grid = span.gridElement

  if (filterVisibleGrid(grid)) {
    showGrid(grid)
  }
}

function filterVisibleGrid(grid) {
  if (grid && grid.classList.contains('hidden')) {
    return grid
  }

  return null
}

function showGrid(grid) {
  grid.classList.remove('hidden')
}
