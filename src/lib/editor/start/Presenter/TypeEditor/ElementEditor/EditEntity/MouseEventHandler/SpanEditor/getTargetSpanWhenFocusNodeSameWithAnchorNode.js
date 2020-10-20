import isFocusInSelectedSpan from './isFocusInSelectedSpan'

export default function(annotationData, selectionModel, selectionWrapper) {
  if (isFocusInSelectedSpan(annotationData, selectionModel, selectionWrapper)) {
    return selectionModel.span.singleId
  }

  return selectionWrapper.selection.focusNode.parentElement.id
}
