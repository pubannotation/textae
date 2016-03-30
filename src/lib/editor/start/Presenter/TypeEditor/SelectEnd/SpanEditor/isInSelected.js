import selectPosition from '../selectPosition'
import * as hasClass from '../hasClass'
import * as getParent from '../getParent'

export {
  isAnchorInSelectedSpan,
  isFocusInSelectedSpan
}

function isAnchorInSelectedSpan(model, selection) {
  return isInSelectedSpan(model, selectPosition.getAnchorPosition(model.annotationData, selection))
}

function isFocusInSelectedSpan(model, selection) {
  return isInSelectedSpan(model, selectPosition.getFocusPosition(model.annotationData, selection))
}


function isInSelectedSpan(model, position) {
  const spanId = model.selectionModel.span.single()

  if (spanId) {
    const selectedSpan = model.annotationData.span.get(spanId)
    return selectedSpan.begin < position && position < selectedSpan.end
  }

  return false
}
