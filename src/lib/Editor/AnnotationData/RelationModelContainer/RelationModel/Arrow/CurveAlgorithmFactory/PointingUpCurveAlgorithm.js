import { MarkerHeight } from '../MarkerHeight'
import CurveAlgorithm from './CurveAlgorithm'

export default class PointingUpCurveAlgorithm extends CurveAlgorithm {
  get isEmphasizable() {
    return false
  }

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

  get targetX() {
    if (!this._chachedTargetX) {
      const unit = 50
      this._chachedTargetX = super.targetX - unit + Math.random() * 2 * unit
    }
    return this._chachedTargetX
  }

  get targetY() {
    return this._controlBarHeight - this._clientTopOfContainer
  }
}
