export default function removedEntitiesFromSpan(
  entityIds,
  annotationData,
  span
) {
  return entityIds.filter(
    (id) => annotationData.entity.get(id).span === span.id
  )
}
