export default function getSpans(entityIds, annotationData) {
  return new Set(
    entityIds.map((id) =>
      annotationData.span.get(annotationData.entity.get(id).span)
    )
  )
}
