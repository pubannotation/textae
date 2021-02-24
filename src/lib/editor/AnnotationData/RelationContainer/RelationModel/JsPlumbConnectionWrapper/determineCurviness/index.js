import getEndpointPosition from './getEndpointPosition'

const CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.3,
  yrate: 0.05,

  // curviness offset
  offset: 60
}

export default function (sourceEndpoint, targetEndpoint) {
  const sourcePosition = getEndpointPosition(sourceEndpoint)
  const targetPosition = getEndpointPosition(targetEndpoint)

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
