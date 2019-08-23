import getDomPositionCache from './getDomPositionCache'

export default function(editor, entity) {
  const domPositionCache = getDomPositionCache(editor, entity)

  return {
    on: (entityId) =>
      processAccosiatedRelation(
        entity,
        domPositionCache,
        (connect) => connect.pointup(),
        entityId
      ),
    off: (entityId) =>
      processAccosiatedRelation(
        entity,
        domPositionCache,
        (connect) => connect.pointdown(),
        entityId
      )
  }
}

function processAccosiatedRelation(entity, domPositionCache, func, entityId) {
  entity
    .assosicatedRelations(entityId)
    .map((relationId) => domPositionCache.toConnect(relationId))
    .filter((connect) => connect.pointup && connect.pointdown)
    .forEach(func)
}
