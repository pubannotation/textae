import {
  ArchedPathPoints,
  BentOnSourcePathPoints,
  BentOnTargetPathPoints,
  PointingDownPathPoints
} from './PathPoints'
import SourceAndTarget from './SourceAndTarget'

export default class PathPointsFactory {
  static create(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer,
    controlBarHeight
  ) {
    const sourceAndTarget = new SourceAndTarget(
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
        sourceAndTarget,
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
        sourceAndTarget,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }

    if (sourceAndTarget.isDownward) {
      return new BentOnTargetPathPoints(
        sourceAndTarget,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    } else {
      return new BentOnSourcePathPoints(
        sourceAndTarget,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }
  }
}
