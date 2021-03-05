export default function (entity) {
  if (entity.span.entities.length === 0) {
    // Destroy a grid when all entities are remove.
    entity.span.destroyGridElement()
  } else {
    // Destroy whole of type DOM.
    entity.destroyElement()
  }
}
