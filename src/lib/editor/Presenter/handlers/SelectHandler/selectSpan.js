export default function(selectionModel, spanId) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')
  console.assert(spanId, 'spanId MUST not undefined.')

  if (spanId) {
    selectionModel.clear()
    selectionModel.span.add(spanId)
  }
}
