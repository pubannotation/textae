import {
  ArchedCurveAlgorithm,
  BentOnSourceCurveAlgorithm,
  BentOnTargetCurveAlgorithm,
  PointingDownCurveAlgorithm,
  PointingUpCurveAlgorithm
} from './CurveAlgorithm'
import StartAndEnd from './StartAndEnd'

export default class CurveAlgorithmFactory {
  static create(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer,
    controlBarHeight
  ) {
    const startAndEnd = new StartAndEnd(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards,
      clientTopOfContainer
    )

    if (
      targetEntity.clientBottom < controlBarHeight &&
      targetEntity.clientTop < sourceEntity.clientTop
    ) {
      return new PointingUpCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }

    if (
      sourceEntity.clientBottom < controlBarHeight &&
      sourceEntity.clientTop < targetEntity.clientTop
    ) {
      return new PointingDownCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }

    if (
      Math.abs(sourceEntity.clientBottom - targetEntity.clientBottom) < 12 ||
      42 < startAndEnd.horizontalDistance
    ) {
      return new ArchedCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }

    if (startAndEnd.isDownward) {
      return new BentOnTargetCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    } else {
      return new BentOnSourceCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }
  }
}
