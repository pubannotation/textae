export default function(annotationData, spanId) {
  return annotationData.span.get(spanId).entities.length === 0
}
