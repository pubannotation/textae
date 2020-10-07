import showInvisibleGrid from '../showInvisibleGrid'
import isMoved from './isMoved'
import updateGridPositon from './updateGridPositon'

export default function(domPositionCache, annotationData, gridHeight, span) {
  // The span may be remeved because this functon is call asynchronously.
  if (!annotationData.span.get(span.id)) {
    return
  }

  const gridElement = span.gridElement
  const { top, left } = domPositionCache.getSpan(span.id)
  const newPosition = {
    top: top - gridHeight.getHeightIncludeDescendantGrids(span),
    left
  }

  if (isMoved(gridElement, newPosition)) {
    updateGridPositon(gridElement, newPosition)
    showInvisibleGrid(gridElement)
  }
}
