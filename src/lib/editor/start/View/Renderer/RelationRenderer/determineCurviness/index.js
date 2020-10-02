import getDomPositionCache from '../../../getDomPositionCache'
import getEndpointPosition from './getEndpointPosition'

const CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  offset: 20
}

export default function(
  editor,
  annotationData,
  relation,
  sourceEndpoint,
  targetEndpoint
) {
  const domPositionCache = getDomPositionCache(editor)

  const sourcePosition = getEndpointPosition(
    sourceEndpoint,
    annotationData,
    relation.subj,
    domPositionCache
  )

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
