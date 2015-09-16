export {
  selectSpan,
  selectSingleSpanById
}

function selectSpan(selectionModel, dom, isMulti) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')

  if (dom) {
    if (isMulti) {
      selectionModel.span.add(dom.id)
    } else {
      selectSingleSpanById(selectionModel, dom.id)
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
