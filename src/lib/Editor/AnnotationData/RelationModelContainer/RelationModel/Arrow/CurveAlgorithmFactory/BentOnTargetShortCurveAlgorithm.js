import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'

export default class BentOnTargetShortCurveAlgorithm extends BentOnTargetCurveAlgorithm {
  get targetY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }

  // No emphasis on relation.
  get isCalm() {
    return true
  }
}
