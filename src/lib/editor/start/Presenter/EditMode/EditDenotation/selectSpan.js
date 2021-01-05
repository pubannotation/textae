export default function (selectionModel, rangeOfSpans, event, spanID) {
  if (rangeOfSpans.length) {
    selectionModel.selectSpanRange(rangeOfSpans)
  } else {
    if (event.ctrlKey || event.metaKey) {
      selectionModel.span.toggle(spanID)
    } else {
      selectionModel.selectSpan(spanID)
    }
  }
}
