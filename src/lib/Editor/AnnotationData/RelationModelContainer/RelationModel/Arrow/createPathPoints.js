import {
  ArchedPathPoints,
  BentOnSourcePathPoints,
  BentOnTargetPathPoints
} from './PathPoints'
import getSourceAndTarget from './PathPoints/getSourceAndTarget'

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
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards,
      clientTopOfContainer,
      controlBarHeight
    )
  }

  if (source.y < target.y) {
    return new BentOnTargetPathPoints(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards,
      clientTopOfContainer,
      controlBarHeight
    )
  } else {
    return new BentOnSourcePathPoints(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards,
      clientTopOfContainer,
      controlBarHeight
    )
  }
}
