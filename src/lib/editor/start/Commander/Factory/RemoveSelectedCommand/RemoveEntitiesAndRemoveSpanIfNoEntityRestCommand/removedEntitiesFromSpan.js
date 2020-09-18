export default function removedEntitiesFromSpan(entities, span) {
  return entities.filter((entity) => entity.span === span)
}
