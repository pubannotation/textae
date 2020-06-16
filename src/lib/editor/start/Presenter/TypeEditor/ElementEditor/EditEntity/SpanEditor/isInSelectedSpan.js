export default function(selectionModel, position) {
  const span = selectionModel.span.single
  if (span) {
    return span.begin < position && position < span.end
  }
  return false
}
