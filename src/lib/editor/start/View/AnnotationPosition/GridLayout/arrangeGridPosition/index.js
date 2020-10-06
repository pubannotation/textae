import showInvisibleGrid from '../showInvisibleGrid'
import isMoved from './isMoved'
import updateGridPositon from './updateGridPositon'
import round from '../../../round.js'
import getPosition from '../../../getPosition'

export default function(annotationData, gridHeight, span) {
  // The span may be remeved because this functon is call asynchronously.
  if (!annotationData.span.get(span.id)) {
    return
  }

  const gridElement = span.gridElement
  const { top, left } = getPosition(span.element)
  const newPosition = {
    top: round(top - gridHeight.getHeightIncludeDescendantGrids(span)),
    left
  }

  if (isMoved(gridElement, newPosition)) {
    updateGridPositon(gridElement, newPosition)
    showInvisibleGrid(gridElement)
  }
}
