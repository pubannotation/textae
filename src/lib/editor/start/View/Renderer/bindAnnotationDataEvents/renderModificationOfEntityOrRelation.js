export default function(
  annotationData,
  modification,
  entityRenderer,
  relationRenderer
) {
  const entity = annotationData.entity.get(modification.obj)
  if (entity) {
    entityRenderer.changeModification(entity)
  }
  const relation = annotationData.relation.get(modification.obj)
  if (relation) {
    relationRenderer.changeModification(relation)
  }
}
