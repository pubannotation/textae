export default function(annotationData, selectionModel, position) {
  const spanId = selectionModel.span.single()
  if (spanId) {
    const selectedSpan = annotationData.span.get(spanId)
    return selectedSpan.begin < position && position < selectedSpan.end
  }
  return false
}
