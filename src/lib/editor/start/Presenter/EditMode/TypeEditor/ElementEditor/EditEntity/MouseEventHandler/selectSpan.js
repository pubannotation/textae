export default function (
  annotationData,
  selectionModel,
  event,
  selectingSpanId
) {
  const selectedSpanId = selectionModel.span.singleId

  if (event.shiftKey && selectedSpanId) {
    // select reange of spans.
    selectionModel.clear()
    for (const id of annotationData.span.rangeDenotationSpan(
      selectedSpanId,
      selectingSpanId
    )) {
      selectionModel.selectSpanById(id)
    }
  } else if (event.ctrlKey || event.metaKey) {
    selectionModel.toggleSpanById(selectingSpanId)
  } else {
    selectionModel.clear()
    selectionModel.selectSpanById(selectingSpanId)
  }
}
