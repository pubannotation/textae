import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'

export default class BentOnSourceShortCurveAlgorithm extends BentOnSourceCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get sourceY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
