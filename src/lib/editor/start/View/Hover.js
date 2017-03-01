import DomPositionCache from './DomPositionCache'
import _ from 'underscore'

export default function(editor, entity) {
  let domPositionCaChe = new DomPositionCache(editor, entity)

  return {
    on: _.partial(
        processAccosiatedRelation,
        entity,
        domPositionCaChe,
        connect => connect.pointup()
    ),
    off: _.partial(
        processAccosiatedRelation,
        entity,
        domPositionCaChe,
        connect => connect.pointdown()
    )
  }
}

function processAccosiatedRelation(entity, domPositionCaChe, func, entityId) {
  entity.assosicatedRelations(entityId)
      .map(domPositionCaChe.toConnect)
      .filter(connect => connect.pointup && connect.pointdown)
      .forEach(func)
}
