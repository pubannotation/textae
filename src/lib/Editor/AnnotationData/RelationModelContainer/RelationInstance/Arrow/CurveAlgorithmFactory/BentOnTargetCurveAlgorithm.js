import CurveAlgorithm from './CurveAlgorithm'

export default class BentOnTargetCurveAlgorithm extends CurveAlgorithm {
  get isSourceJettyVisible() {
    return true
  }

  get isTargetJettyVisible() {
    return true
  }

  get pathCommands() {
    return `M ${this.sourceX}, ${this.sourceY}
              C ${this._sourceControlX} ${this._controlY}, ${this._targetControlX} ${this._controlY}, ${this._junctionPointX} ${this._junctionPointY}
              Q ${this.targetX} ${this._additionalControlY}, ${this.targetX} ${this.targetY}`
  }

  getTForY(y) {
    const sample = 20

    // https://ja.javascript.info/bezier-curve
    // (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    return [...Array(sample).keys()]
      .map((i) => (i * 1) / sample)
      .find((t) => {
        const labelY =
          Math.pow(1 - t, 3) * this.sourceY +
          3 * Math.pow(1 - t, 2) * t * this._controlY +
          3 * (1 - t) * Math.pow(t, 2) * this._controlY +
          Math.pow(t, 3) * this._junctionPointY
        return Math.abs(labelY - y) < 1
      })
  }

  get _additionalControlY() {
    return this.sourceY * 0.3 + this.targetY * 0.7
  }

  get _junctionPointX() {
    return this._targetControlX * 0.25 + this.targetX * 0.75
  }

  get _junctionPointY() {
    return this._controlY * 0.25 + this._additionalControlY * 0.75
  }

  get _targetControlX() {
    return (
      this._startAndEnd.end.x +
      (this._startAndEnd.isPointingToRight ? 150 : -150)
    )
  }
}
