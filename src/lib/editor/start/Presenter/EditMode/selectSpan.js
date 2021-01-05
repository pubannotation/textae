export default function (
  selectionModel,
  event,
  selectedSpanId,
  selectingSpanId,
  getRangeFunc
) {
  if (event.shiftKey && selectedSpanId) {
    // select reange of spans.
    selectionModel.clear()
    for (const id of getRangeFunc(selectedSpanId, selectingSpanId)) {
      selectionModel.selectSpanById(id)
    }
  } else if (event.ctrlKey || event.metaKey) {
    selectionModel.toggleSpanById(selectingSpanId)
  } else {
    selectionModel.clear()
    selectionModel.selectSpanById(selectingSpanId)
  }
}
