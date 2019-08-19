import isFocusInSelectedSpan from '../isFocusInSelectedSpan'

export default function(annotationData, selectionModel, selection) {
  if (isFocusInSelectedSpan(annotationData, selectionModel, selection)) {
    return selectionModel.span.single()
  }

  return selection.focusNode.parentElement.id
}
