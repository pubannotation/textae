import {
  ArchedPathPoints,
  BentOnSourcePathPoints,
  BentOnTargetPathPoints
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
  const [source, target] = getSourceAndTarget(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer
  )

  if (
    Math.abs(sourceEntity.clientBottom - targetEntity.clientBottom) < 12 ||
    42 < Math.abs(target.x - source.x)
  ) {
    return new ArchedPathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight
    )
  }

  if (source.y < target.y) {
    return new BentOnTargetPathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight
    )
  } else {
    return new BentOnSourcePathPoints(
      source,
      target,
      alignSourceBollards,
      alignTargetBollards,
      controlBarHeight
    )
  }
}
