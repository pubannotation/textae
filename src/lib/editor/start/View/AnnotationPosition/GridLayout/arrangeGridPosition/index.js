import isMoved from './isMoved'
import updateGridPositon from './updateGridPositon'

export default function(annotationData, textBox, gridRectangle, span) {
  // The span may be remeved because this functon is call asynchronously.
  if (!annotationData.span.get(span.id)) {
    return
  }

  const gridElement = span.gridElement
  const { top, left } = gridRectangle.getRectangle(textBox, span)

  if (isMoved(gridElement, top, left)) {
    updateGridPositon(gridElement, top, left)
  }
}
