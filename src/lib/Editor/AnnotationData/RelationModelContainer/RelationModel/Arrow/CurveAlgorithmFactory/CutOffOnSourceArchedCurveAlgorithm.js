import ArchedCurveAlgorithm from './ArchedCurveAlgorithm'

export default class CutOffOnSourceArchedCurveAlgorithm extends ArchedCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get sourceY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
