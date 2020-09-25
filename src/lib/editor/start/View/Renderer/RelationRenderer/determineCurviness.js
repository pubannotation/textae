import getDomPositionCache from '../../getDomPositionCache'

const CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  offset: 20
}

export default function(editor, annotationData, relation) {
  const domPositionCache = getDomPositionCache(editor, annotationData.entity)

  const sourcePosition = domPositionCache.getEntity(relation.subj)
  const targetPosition = domPositionCache.getEntity(relation.obj)

  const sourceX = sourcePosition.center
  const targetX = targetPosition.center

  const sourceY = sourcePosition.top
  const targetY = targetPosition.top

  const xdiff = Math.abs(sourceX - targetX)
  const ydiff = Math.abs(sourceY - targetY)
  let curviness =
    xdiff * CURVINESS_PARAMETERS.xrate +
    ydiff * CURVINESS_PARAMETERS.yrate +
    CURVINESS_PARAMETERS.offset
  curviness /= 2.4

  return curviness
}
