import {
  ArchedCurveAlgorithm,
  BentOnSourceCurveAlgorithm,
  BentOnTargetCurveAlgorithm,
  PointingDownCurveAlgorithm
} from './CurveAlgorithm'
import SourceAndTarget from './SourceAndTarget'

export default class CurveAlgorithmFactory {
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
      return new PointingDownCurveAlgorithm(
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
      return new ArchedCurveAlgorithm(
        sourceAndTarget,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }

    if (sourceAndTarget.isDownward) {
      return new BentOnTargetCurveAlgorithm(
        sourceAndTarget,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    } else {
      return new BentOnSourceCurveAlgorithm(
        sourceAndTarget,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }
  }
}
