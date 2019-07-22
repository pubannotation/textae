import sameAttribute from './sameAttribute'
export default function(annotationData, entityId, pred, obj) {
  return annotationData.entity.get(entityId).attributes.find(sameAttribute(pred, obj))
}
