import { MarkerHeight } from '../MarkerHeight'
import CurveAlgorithm from './CurveAlgorithm'

export default class PointingUpCurveAlgorithm extends CurveAlgorithm {
  get pathCommands() {
    return `M ${this.sourceX}, ${this.sourceY}
      C ${this._sourceControlX} ${
      this.sourceY - Math.abs(this.targetY - this.sourceY) / 3
    }, ${this._targetControlX} ${
      this.targetY + Math.abs(this.targetY - this.sourceY) / 3
    }, ${this.targetX} ${this.targetY + MarkerHeight}`
  }

  get transformDefinitionsForTargetTriangle() {
    return ` rotate(180, ${this.targetX}, ${this.targetY + 3}) translate(${
      this.targetX
    }, ${this.targetY})`
  }

  get targetY() {
    return this._controlBarHeight - this._clientTopOfContainer
  }

  // No emphasis on relation.
  get isCalm() {
    return true
  }
}
