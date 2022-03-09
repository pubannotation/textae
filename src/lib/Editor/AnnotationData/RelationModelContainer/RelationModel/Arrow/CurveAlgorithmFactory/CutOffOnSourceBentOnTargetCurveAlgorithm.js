import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'

export default class CutOffOnSourceBentOnTargetCurveAlgorithm extends BentOnTargetCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get sourceX() {
    if (!this._chachedSourceX) {
      const unit = 50
      this._chachedSourceX = super.sourceX - unit + Math.random() * 2 * unit
    }
    return this._chachedSourceX
  }

  get sourceY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
