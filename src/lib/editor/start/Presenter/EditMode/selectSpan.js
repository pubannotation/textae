export default function (
  selectionModel,
  event,
  selectedSpanID,
  selectingSpanID,
  rangeOfSpans
) {
  if (event.shiftKey && rangeOfSpans.length) {
    // select reange of spans.
    selectionModel.clear()
    for (const id of rangeOfSpans) {
      selectionModel.selectSpanById(id)
    }
  } else if (event.ctrlKey || event.metaKey) {
    selectionModel.toggleSpanById(selectingSpanID)
  } else {
    selectionModel.clear()
    selectionModel.selectSpanById(selectingSpanID)
  }
}
