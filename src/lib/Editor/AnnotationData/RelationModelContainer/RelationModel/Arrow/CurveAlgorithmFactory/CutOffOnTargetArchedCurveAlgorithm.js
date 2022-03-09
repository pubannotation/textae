import ArchedCurveAlgorithm from './ArchedCurveAlgorithm'

export default class CutOffOnTargetArchedCurveAlgorithm extends ArchedCurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get targetY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
