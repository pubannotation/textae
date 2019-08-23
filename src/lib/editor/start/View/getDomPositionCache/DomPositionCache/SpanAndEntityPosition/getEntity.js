import getEntityDom from '../../../../getEntityDom'

export default function(editor, entityModel, gridPositionCache, entityId) {
  const entity = getEntityDom(editor[0], entityId)

  if (!entity) {
    throw new Error(`entity is not rendered : ${entityId}`)
  }

  const spanId = entityModel.get(entityId).span
  const gridPosition = gridPositionCache.get(spanId)

  return {
    top: gridPosition.top + entity.offsetTop,
    center: gridPosition.left + entity.offsetLeft + entity.offsetWidth / 2
  }
}
