import ArchedCurveAlgorithm from './ArchedCurveAlgorithm'
import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'
import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'
import CutOffOnSourceArchedCurveAlgorithm from './CutOffOnSourceArchedCurveAlgorithm'
import CutOffOnSourceBentOnSourceCurveAlgorithm from './CutOffOnSourceBentOnSourceCurveAlgorithm'
import CutOffOnSourceBentOnTargetCurveAlgorithm from './CutOffOnSourceBentOnTargetCurveAlgorithm'
import CutOffOnTargetArchedCurveAlgorithm from './CutOffOnTargetArchedCurveAlgorithm'
import CutOffOnTargetBentOnSourceCurveAlgorithm from './CutOffOnTargetBentOnSourceCurveAlgorithm'
import CutOffOnTargetBentOnTargetCurveAlgorithm from './CutOffOnTargetBentOnTargetCurveAlgorithm'
import PointingDownCurveAlgorithm from './PointingDownCurveAlgorithm'
import PointingUpCurveAlgorithm from './PointingUpCurveAlgorithm'
import StartAndEnd from './StartAndEnd'

export default class CurveAlgorithmFactory {
  static create(
    relation,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer,
    toolBarHeight
  ) {
    const startAndEnd = new StartAndEnd(
      relation,
      alignSourceBollards,
      alignTargetBollards
    )

    const { sourceEntity, targetEntity } = relation

    if (
      targetEntity.clientBottom < toolBarHeight &&
      targetEntity.clientTop < sourceEntity.clientTop
    ) {
      return new PointingUpCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        toolBarHeight,
        clientTopOfContainer
      )
    }

    if (
      sourceEntity.clientBottom < toolBarHeight &&
      sourceEntity.clientTop < targetEntity.clientTop
    ) {
      return new PointingDownCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        toolBarHeight,
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
          toolBarHeight,
          clientTopOfContainer
        )
      }

      if (clientHeight < targetEntity.clientTop) {
        return new CutOffOnTargetArchedCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          toolBarHeight,
          clientTopOfContainer
        )
      }

      return new ArchedCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        toolBarHeight,
        clientTopOfContainer
      )
    }

    if (startAndEnd.isDownward) {
      if (clientHeight < sourceEntity.clientTop) {
        return new CutOffOnSourceBentOnTargetCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          toolBarHeight,
          clientTopOfContainer
        )
      }

      if (clientHeight < targetEntity.clientTop) {
        return new CutOffOnTargetBentOnTargetCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          toolBarHeight,
          clientTopOfContainer
        )
      }

      return new BentOnTargetCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        toolBarHeight,
        clientTopOfContainer
      )
    } else {
      if (clientHeight < sourceEntity.clientTop) {
        return new CutOffOnSourceBentOnSourceCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          toolBarHeight,
          clientTopOfContainer
        )
      }

      if (clientHeight < targetEntity.clientTop) {
        return new CutOffOnTargetBentOnSourceCurveAlgorithm(
          startAndEnd,
          alignSourceBollards,
          alignTargetBollards,
          toolBarHeight,
          clientTopOfContainer
        )
      }

      return new BentOnSourceCurveAlgorithm(
        startAndEnd,
        alignSourceBollards,
        alignTargetBollards,
        toolBarHeight,
        clientTopOfContainer
      )
    }
  }
}
