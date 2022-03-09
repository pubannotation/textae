import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'

export default class CutOffOnTargetBentOnSourceCurveAlgorithm extends BentOnSourceCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get targetX() {
    if (!this._chachedTargetX) {
      const unit = 50
      this._chachedTargetX = super.targetX - unit + Math.random() * 2 * unit
    }
    return this._chachedTargetX
  }

  get targetY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
