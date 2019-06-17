export default function(annotationData, spanId) {
  return annotationData.span.get(spanId).getTypes().length === 0
}
