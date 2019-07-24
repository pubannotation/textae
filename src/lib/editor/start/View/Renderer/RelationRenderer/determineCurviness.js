import DomPositionCache from '../../DomPositionCache'

const CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  offset: 20
}

export default function(editor, annotationData, relation) {
  const domPositionCache = new DomPositionCache(editor, annotationData.entity)

  const anchors = toAnchors(relation)
  const sourcePosition = domPositionCache.getEntity(anchors.sourceId)
  const targetPosition = domPositionCache.getEntity(anchors.targetId)

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

function toAnchors(relation) {
  return {
    sourceId: relation.subj,
    targetId: relation.obj
  }
}
