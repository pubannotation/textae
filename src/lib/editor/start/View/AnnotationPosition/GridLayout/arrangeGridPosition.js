import getGridPosition from './getGridPosition'
import getGridOfSpan from './getGridOfSpan'
import showInvisibleGrid from './showInvisibleGrid'

export default function(domPositionCache, typeContainer, annotationData, typeGap, span) {
  // The span may be remeved because this functon is call asynchronously.
  if (!annotationData.span.get(span.id)) {
    return
  }

  const newPosition = getGridPosition(domPositionCache.getSpan, typeContainer, typeGap, span)

  if (isDifferent(domPositionCache.getGrid(span.id), newPosition)) {
    console.log('bb', domPositionCache.getGrid(span.id), newPosition)

    // Move all relations because entities are increased or decreased unless the grid is moved.
    updateGridPositon(span, newPosition)
    updatePositionCache(domPositionCache, span, newPosition)
    showInvisibleGrid(span)
  }
}

function isDifferent(oldPosition, newPosition) {
  if (!oldPosition || oldPosition.top !== newPosition.top || oldPosition.left !== newPosition.left) {
    return true
  }

  return false
}

function updateGridPositon(span, newPosition) {
  const grid = getGridOfSpan(span.id)

  if (grid) {
    grid.style.top = `${newPosition.top}px`
    grid.style.left = `${newPosition.left}px`
  }
}

function updatePositionCache(domPositionCache, span, newPosition) {
  domPositionCache.setGrid(span.id, newPosition)
}
