export default function(selectionModel, span) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')

  if (span) {
    selectionModel.clear()
    selectionModel.span.add(span.id)
  }
}
