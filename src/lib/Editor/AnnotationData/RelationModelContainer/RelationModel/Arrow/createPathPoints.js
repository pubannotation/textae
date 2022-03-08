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
  const { source, target } = getSourceAndTarget(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer
  )

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
    42 < Math.abs(target.x - source.x)
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

  if (source.y < target.y) {
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
