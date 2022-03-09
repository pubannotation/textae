import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'

export default class CutOffOnSourceBentOnSourceCurveAlgorithm extends BentOnSourceCurveAlgorithm {
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
