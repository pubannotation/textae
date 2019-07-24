export default function(entities, spanId, newOne) {
  entities
    .filter((entity) => spanId === entity.span)
    .forEach((entity) => {
      entity.span = newOne.id
    })

  return null
}
