import getDomPositionCache from '../../getDomPositionCache'
import getEntityEndopointDom from '../../getEntityEndopointDom'

const CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  offset: 20
}

export default function(editor, annotationData, relation) {
  const domPositionCache = getDomPositionCache(editor)
  const sourcePosition = getEntity(
    editor,
    annotationData,
    relation.subj,
    domPositionCache
  )
  const targetPosition = getEntity(
    editor,
    annotationData,
    relation.obj,
    domPositionCache
  )

  const sourceX = sourcePosition.center
  const targetX = targetPosition.center

  const sourceY = sourcePosition.top
  const targetY = targetPosition.top

  const xdiff = Math.abs(sourceX - targetX)
  const ydiff = Math.abs(sourceY - targetY)

  return (
    (xdiff * CURVINESS_PARAMETERS.xrate +
      ydiff * CURVINESS_PARAMETERS.yrate +
      CURVINESS_PARAMETERS.offset) /
    2.4
  )
}

function getEntity(editor, annotationData, entityId, domPositionCache) {
  const entity = getEntityEndopointDom(editor, entityId)

  if (!entity) {
    throw new Error(`entity is not rendered : ${entityId}`)
  }

  const spanId = annotationData.entity.get(entityId).span.id
  const gridPosition = domPositionCache.getGrid(spanId)

  return {
    top: gridPosition.top + entity.offsetTop,
    center: gridPosition.left + entity.offsetLeft + entity.offsetWidth / 2
  }
}
