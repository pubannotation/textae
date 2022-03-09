import BentOnSourceCurveAlgorithm from './BentOnSourceCurveAlgorithm'

export default class BentOnSourceShortCurveAlgorithm extends BentOnSourceCurveAlgorithm {
  get sourceY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }

  // No emphasis on relation.
  get isCalm() {
    return true
  }
}
