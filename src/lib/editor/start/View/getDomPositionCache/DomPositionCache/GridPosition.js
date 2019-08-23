import LesserMap from './LesserMap'

export default function(entityModel) {
  // The chache for position of grids.
  // This is updated at arrange position of grids.
  // This is referenced at create or move relations.
  const map = new LesserMap()

  return Object.assign(map, {
    isGridPrepared: (entityId) => isGridPrepared(entityModel, map, entityId)
  })
}

function isGridPrepared(entityModel, map, entityId) {
  const spanId = entityModel.get(entityId).span
  return map.get(spanId)
}
