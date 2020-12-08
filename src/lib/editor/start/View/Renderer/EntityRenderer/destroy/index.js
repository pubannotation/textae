import doesSpanHasNoEntity from './doesSpanHasNoEntity'

export default function (entity) {
  if (doesSpanHasNoEntity(entity.span)) {
    // Destroy a grid when all entities are remove.
    entity.span.destroyGridElement()
  } else {
    // Destroy whole of type DOM.
    entity.destroyElement()
  }
}
