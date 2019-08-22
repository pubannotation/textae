export default function(annotationData, spanId) {
  return annotationData.span.get(spanId).types.length === 0
}
