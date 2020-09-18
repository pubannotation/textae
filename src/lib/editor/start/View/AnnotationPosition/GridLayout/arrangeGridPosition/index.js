import showInvisibleGrid from '../showInvisibleGrid'
import isMoved from './isMoved'
import updateGridPositon from './updateGridPositon'

export default function(domPositionCache, annotationData, gridHeight, span) {
  // The span may be remeved because this functon is call asynchronously.
  if (!annotationData.span.get(span.id)) {
    return
  }

  const { top, left } = domPositionCache.getSpan(span.id)
  const newPosition = {
    top: top - gridHeight.getHeightIncludeDescendantGrids(span),
    left
  }

  if (isMoved(domPositionCache.getGrid(span.id), newPosition)) {
    // Move all relations because entities are increased or decreased unless the grid is moved.
    updateGridPositon(span, newPosition)
    domPositionCache.setGrid(span.id, newPosition)
    showInvisibleGrid(span)
  }
}
