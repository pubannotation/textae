export default function getSpans(entities) {
  return new Set(entities.map((entity) => entity.span))
}
