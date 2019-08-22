export default function(span, renderEntityFunc) {
  for (const entity of span.getEntities()) {
    renderEntityFunc(entity)
  }
}
