import DomPositionCache from './DomPositionCache'
import _ from 'underscore'

export default function(editor, entity) {
  const domPositionCache = new DomPositionCache(editor, entity)

  return {
    on: _.partial(
      processAccosiatedRelation,
      entity,
      domPositionCache,
      (connect) => connect.pointup()
    ),
    off: _.partial(
      processAccosiatedRelation,
      entity,
      domPositionCache,
      (connect) => connect.pointdown()
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
