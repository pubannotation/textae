export default function(annotationData, selectionModel, event, spanId) {
  const firstId = selectionModel.span.singleId

  if (event.shiftKey && firstId) {
    // select reange of spans.
    selectionModel.clear()
    for (const spanId of annotationData.span.range(firstId, spanId)) {
      selectionModel.selectSpanWithBlockEntities(spanId)
    }
  } else if (event.ctrlKey || event.metaKey) {
    selectionModel.toggleSpanWithBlockEntities(spanId)
  } else {
    selectionModel.clear()
    selectionModel.selectSpanWithBlockEntities(spanId)
  }
}
