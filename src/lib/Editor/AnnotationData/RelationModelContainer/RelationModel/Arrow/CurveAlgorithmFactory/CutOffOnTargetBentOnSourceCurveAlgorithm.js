import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'

export default class CutOffOnTargetBentOnSourceCurveAlgorithm extends BentOnSourceCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get targetY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
