export default function(
  annotationData,
  selectionModel,
  event,
  selectingSpanId
) {
  const selectedSpanId = selectionModel.span.singleId

  if (event.shiftKey && selectedSpanId) {
    // select reange of spans.
    selectionModel.clear()
    for (const id of annotationData.span.range(
      selectedSpanId,
      selectingSpanId
    )) {
      selectionModel.selectSpanWithBlockEntities(id)
    }
  } else if (event.ctrlKey || event.metaKey) {
    selectionModel.toggleSpanWithBlockEntities(selectingSpanId)
  } else {
    selectionModel.clear()
    selectionModel.selectSpanWithBlockEntities(selectingSpanId)
  }
}
