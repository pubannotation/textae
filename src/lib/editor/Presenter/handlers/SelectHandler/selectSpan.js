export {
  selectSpan,
  selectSingleSpanById
}

function selectSpan(selectionModel, span, shiftKey) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')

  if (span) {
    if (shiftKey) {
      selectionModel.span.add(span.id)
    } else {
      selectSingleSpanById(selectionModel, span.id)
    }
  }
}

function selectSingleSpanById(selectionModel, spanId) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')

  if (spanId) {
    selectionModel.clear()
    selectionModel.span.add(spanId)
  }
}
