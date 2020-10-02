export default function(endpoint, annotationData, entityId, domPositionCache) {
  const spanId = annotationData.entity.get(entityId).span.id
  const gridPosition = domPositionCache.getGrid(spanId)

  return {
    top: gridPosition.top + endpoint.offsetTop,
    center: gridPosition.left + endpoint.offsetLeft + endpoint.offsetWidth / 2
  }
}
