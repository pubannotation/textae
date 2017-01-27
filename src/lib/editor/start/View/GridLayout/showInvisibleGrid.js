import getGridOfSpan from './getGridOfSpan'

export default function showInvisibleGrid(span) {
  const grid = getGridOfSpan(span.id)

  if (filterVisibleGrid(grid)) {
    showGrid(grid)
  }
}

function filterVisibleGrid(grid) {
  if (grid && grid.classList.contains('hidden')) {
    return grid
  }
}

function showGrid(grid) {
  grid.classList.remove('hidden')
}
