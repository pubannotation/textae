export default function (selectionModel, rangeOfSpans, event, spanID) {
  if (rangeOfSpans.length) {
    selectionModel.selectSpanRange(rangeOfSpans)
    return
  }

  if (event.ctrlKey || event.metaKey) {
    selectionModel.span.toggle(spanID)
    return
  }

  selectionModel.selectSpan(spanID)
}
