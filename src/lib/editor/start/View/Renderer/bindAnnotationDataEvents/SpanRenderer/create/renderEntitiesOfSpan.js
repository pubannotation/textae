export default function(span, renderEntityFunc) {
  for (const entity of span.entities) {
    renderEntityFunc(entity)
  }
}
