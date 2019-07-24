import * as selectPosition from '../selectPosition'
import * as hasClass from '../hasClass'
import * as getParent from '../getParent'

export { isAnchorInSelectedSpan, isFocusInSelectedSpan }

function isAnchorInSelectedSpan(annotationData, selectionModel, selection) {
  return isInSelectedSpan(
    annotationData,
    selectionModel,
    selectPosition.getAnchorPosition(annotationData, selection)
  )
}

function isFocusInSelectedSpan(annotationData, selectionModel, selection) {
  return isInSelectedSpan(
    annotationData,
    selectionModel,
    selectPosition.getFocusPosition(annotationData, selection)
  )
}

function isInSelectedSpan(annotationData, selectionModel, position) {
  const spanId = selectionModel.span.single()

  if (spanId) {
    const selectedSpan = annotationData.span.get(spanId)
    return selectedSpan.begin < position && position < selectedSpan.end
  }

  return false
}
