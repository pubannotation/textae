export default function(annotationData, entityId, pred) {
  const entity = annotationData.entity.get(entityId)
  return entity.type.attributes.every((attr) => attr.pred !== pred)
}
