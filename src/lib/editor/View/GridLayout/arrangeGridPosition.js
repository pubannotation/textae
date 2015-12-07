import getGridPosition from './getGridPosition'
import getGridOfSpan from './getGridOfSpan'
import showInvisibleGrid from './showInvisibleGrid'

export default function(domPositionCaChe, typeContainer, typeGapValue, annotationData, span) {
  // The span may be remeved because this functon is call asynchronously.
  if (!annotationData.span.get(span.id)) {
    return
  }

  const newPosition = getGridPosition(domPositionCaChe.getSpan, typeContainer, typeGapValue, span)

  if (filterMoved(domPositionCaChe.getGrid(span.id), newPosition) === null) {
    return
  }

  // Move all relations because entities are increased or decreased unless the grid is moved.
  updateGridPositon(span, newPosition)
  updatePositionCache(domPositionCaChe, span, newPosition)
  showInvisibleGrid(span)
}

function filterMoved(oldPosition, newPosition) {
  if (!oldPosition || oldPosition.top !== newPosition.top || oldPosition.left !== newPosition.left) {
    return newPosition
  } else {
    return null
  }
}

function updateGridPositon(span, newPosition) {
  const grid = getGridOfSpan(span.id)

  if (grid) {
    grid.style.top = `${newPosition.top}px`
    grid.style.left = `${newPosition.left}px`
  }
}

function updatePositionCache(domPositionCaChe, span, newPosition) {
  domPositionCaChe.setGrid(span.id, newPosition)
}
