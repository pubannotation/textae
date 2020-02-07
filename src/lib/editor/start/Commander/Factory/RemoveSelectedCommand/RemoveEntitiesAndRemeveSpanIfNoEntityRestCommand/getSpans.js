export default function getSpans(entities, annotationData) {
  return new Set(entities.map((entity) => annotationData.span.get(entity.span)))
}
