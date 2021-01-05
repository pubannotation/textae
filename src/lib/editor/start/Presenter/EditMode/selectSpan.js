export default function (
  selectionModel,
  event,
  selectingSpanID,
  rangeOfSpans,
  isToggle
) {
  if (rangeOfSpans.length) {
    // select reange of spans.
    selectionModel.clear()
    for (const id of rangeOfSpans) {
      selectionModel.selectSpanById(id)
    }
  } else if (isToggle) {
    selectionModel.toggleSpanById(selectingSpanID)
  } else {
    selectionModel.clear()
    selectionModel.selectSpanById(selectingSpanID)
  }
}
