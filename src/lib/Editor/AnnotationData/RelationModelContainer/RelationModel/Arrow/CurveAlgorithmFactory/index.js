import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'
import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'
import PointingDownCurveAlgorithm from './PointingDownCurveAlgorithm'
import PointingUpCurveAlgorithm from './PointingUpCurveAlgorithm'
import ArchedCurveAlgorithm from './ArchedCurveAlgorithm'
import StartAndEnd from './StartAndEnd'
import BentOnSourceShortCurveAlgorithm from './BentOnSourceShortCurveAlgorithm'
import BentOnTargetShortCurveAlgorithm from './BentOnTargetShortCurveAlgorithm'

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

    const { clientHeight } = document.documentElement
    if (startAndEnd.isDownward) {
      if (clientHeight < targetEntity.clientTop) {
        return new BentOnTargetShortCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          controlBarHeight,
          clientTopOfContainer
        )
      }

      return new BentOnTargetCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    } else {
      if (clientHeight < sourceEntity.clientTop) {
        return new BentOnSourceShortCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          controlBarHeight,
          clientTopOfContainer
        )
      }

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
