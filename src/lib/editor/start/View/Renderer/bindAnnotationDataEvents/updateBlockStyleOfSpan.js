export default function(annotationData, entity, spanRenderer) {
  // Change css class of the span according to the type is block or not.
  const span = annotationData.span.get(entity.span)
  spanRenderer.change(span)
}
