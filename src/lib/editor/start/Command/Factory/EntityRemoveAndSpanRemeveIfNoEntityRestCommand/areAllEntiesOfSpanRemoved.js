export default function areAllEntiesOfSpanRemoved(span, removedEntities) {
  return span
    .getEntities()
    .every((entity) => removedEntities.includes(entity.id))
}
