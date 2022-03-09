import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'
import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'
import PointingDownCurveAlgorithm from './PointingDownCurveAlgorithm'
import PointingUpCurveAlgorithm from './PointingUpCurveAlgorithm'
import ArchedCurveAlgorithm from './ArchedCurveAlgorithm'
import StartAndEnd from './StartAndEnd'
import CutOffOnSourceBentOnSourceCurveAlgorithm from './CutOffOnSourceBentOnSourceCurveAlgorithm'
import CutOffOnTargetBentOnTargetCurveAlgorithm from './CutOffOnTargetBentOnTargetCurveAlgorithm'
import CutOffOnSourceBentOnTargetCurveAlgorithm from './CutOffOnSourceBentOnTargetCurveAlgorithm'
import CutOffOnTargetBentOnSourceCurveAlgorithm from './CutOffOnTargetBentOnSourceCurveAlgorithm'
import CutOffOnSourceArchedCurveAlgorithm from './CutOffOnSourceArchedCurveAlgorithm'
import CutOffOnTargetArchedCurveAlgorithm from './CutOffOnTargetArchedCurveAlgorithm'

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

    const { clientHeight } = document.documentElement
    if (
      Math.abs(sourceEntity.clientBottom - targetEntity.clientBottom) < 12 ||
      42 < startAndEnd.horizontalDistance
    ) {
      if (clientHeight < sourceEntity.clientTop) {
        return new CutOffOnSourceArchedCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          controlBarHeight,
          clientTopOfContainer
        )
      }

      if (clientHeight < targetEntity.clientTop) {
        return new CutOffOnTargetArchedCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          controlBarHeight,
          clientTopOfContainer
        )
      }

      return new ArchedCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        controlBarHeight,
        clientTopOfContainer
      )
    }

    if (startAndEnd.isDownward) {
      if (clientHeight < sourceEntity.clientTop) {
        return new CutOffOnSourceBentOnTargetCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          controlBarHeight,
          clientTopOfContainer
        )
      }

      if (clientHeight < targetEntity.clientTop) {
        return new CutOffOnTargetBentOnTargetCurveAlgorithm(
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
        return new CutOffOnSourceBentOnSourceCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          controlBarHeight,
          clientTopOfContainer
        )
      }

      if (clientHeight < targetEntity.clientTop) {
        return new CutOffOnTargetBentOnSourceCurveAlgorithm(
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
