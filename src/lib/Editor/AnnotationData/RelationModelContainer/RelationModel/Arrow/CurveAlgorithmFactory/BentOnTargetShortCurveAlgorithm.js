import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'

export default class BentOnTargetShortCurveAlgorithm extends BentOnTargetCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get targetY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
