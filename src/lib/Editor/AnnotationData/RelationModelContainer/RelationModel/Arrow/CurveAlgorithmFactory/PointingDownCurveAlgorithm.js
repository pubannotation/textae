import { MarkerHeight } from '../MarkerHeight'
import CurveAlgorithm from './CurveAlgorithm'

export default class PointingDownCurveAlgorithm extends CurveAlgorithm {
  get isEmphasizable() {
    return false
  }

  get pathCommands() {
    return `M ${this.sourceX}, ${this.sourceY + MarkerHeight}
      C ${this._sourceControlX} ${
      this.sourceY + Math.abs(this.targetY - this.sourceY) / 3
    }, ${this._targetControlX} ${
      this.targetY - Math.abs(this.targetY - this.sourceY) / 3
    }, ${this.targetX} ${this.targetY}`
  }

  get transformDefinitionsForSourceTriangle() {
    return ` rotate(180, ${this.sourceX}, ${this.sourceY + 3}) translate(${
      this.sourceX
    }, ${this.sourceY})`
  }

  get sourceY() {
    return this._controlBarHeight - this._clientTopOfContainer
  }
}
