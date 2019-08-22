import DomPositionCache from './DomPositionCache'

export default function(editor, entity) {
  const domPositionCache = new DomPositionCache(editor, entity)

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
    .map(domPositionCache.toConnect)
    .filter((connect) => connect.pointup && connect.pointdown)
    .forEach(func)
}
