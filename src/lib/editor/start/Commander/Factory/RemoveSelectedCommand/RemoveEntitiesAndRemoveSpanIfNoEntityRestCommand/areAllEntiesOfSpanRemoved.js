export default function areAllEntiesOfSpanRemoved(span, removedEntities) {
  return span.entities.every((entity) => removedEntities.includes(entity))
}
