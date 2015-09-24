// Change view mode accoding to the annotation data.
export default function(annotationData) {
  return !annotationData.relation.some() && annotationData.span.multiEntities().length === 0;
}
