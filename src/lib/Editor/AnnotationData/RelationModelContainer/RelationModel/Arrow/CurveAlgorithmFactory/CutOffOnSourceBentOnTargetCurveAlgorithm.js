import BentOnTargetCurveAlgorithm from './BentOnTargetCurveAlgorithm'

export default class CutOffOnSourceBentOnTargetCurveAlgorithm extends BentOnTargetCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get sourceX() {
    return (
      super.sourceX -
      this._virtualEntityWidth / 2 +
      this._virtualEntityWidth * this._startAndEnd.sourceXShiftRate
    )
  }

  get sourceY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
