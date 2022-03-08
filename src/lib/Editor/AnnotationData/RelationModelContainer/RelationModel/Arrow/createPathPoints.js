import {
  ArchedPathPoints,
  BentOnSourcePathPoints,
  BentOnTargetPathPoints,
  PointingDownPathPoints
} from './PathPoints'
import getSourceAndTarget from './getSourceAndTarget'

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards,
  clientTopOfContainer,
  controlBarHeight
) {
  const sourceAndTarget = getSourceAndTarget(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer
  )
  const { source, target } = sourceAndTarget

  if (
    sourceEntity.clientBottom < controlBarHeight &&
    sourceEntity.clientTop < targetEntity.clientTop
  ) {
    return new PointingDownPathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight,
      clientTopOfContainer
    )
  }

  if (
    Math.abs(sourceEntity.clientBottom - targetEntity.clientBottom) < 12 ||
    42 < sourceAndTarget.horizontalDistance
  ) {
    return new ArchedPathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight,
      clientTopOfContainer
    )
  }

  if (sourceAndTarget.isDownward) {
    return new BentOnTargetPathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight,
      clientTopOfContainer
    )
  } else {
    return new BentOnSourcePathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight,
      clientTopOfContainer
    )
  }
}
