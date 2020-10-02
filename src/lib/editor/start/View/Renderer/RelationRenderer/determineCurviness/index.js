import getDomPositionCache from '../../../getDomPositionCache'
import getEntityEndopointDom from '../../../getEntityEndopointDom'
import getEndpointPosition from './getEndpointPosition'

const CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  offset: 20
}

export default function(editor, annotationData, relation) {
  const domPositionCache = getDomPositionCache(editor)

  const sourceEndpoint = getEntityEndopointDom(editor, relation.subj)
  if (!sourceEndpoint) {
    throw new Error(`entity is not rendered : ${relation.subj}`)
  }

  const sourcePosition = getEndpointPosition(
    sourceEndpoint,
    annotationData,
    relation.subj,
    domPositionCache
  )

  const targetEndpoint = getEntityEndopointDom(editor, relation.obj)
  if (!targetEndpoint) {
    throw new Error(`entity is not rendered : ${relation.obj}`)
  }

  const targetPosition = getEndpointPosition(
    targetEndpoint,
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
