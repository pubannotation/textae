import CurveAlgorithm from './CurveAlgorithm'

export default class BentOnSourceCurveAlgorithm extends CurveAlgorithm {
  get pathCommands() {
    return `M ${this.sourceX}, ${this.sourceY}
              Q ${this.sourceX} ${this._additionalControlY}, ${this._junctionPointX} ${this._junctionPointY}
              C ${this._sourceControlX} ${this._controlY}, ${this._targetControlX} ${this._controlY}, ${this.targetX} ${this.targetY}`
  }

  getTForY(y) {
    const sample = 20

    // https://ja.javascript.info/bezier-curve
    // (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    return [...Array(sample).keys()]
      .map((i) => (i * 1) / sample)
      .find((t) => {
        const labelY =
          Math.pow(1 - t, 3) * this._junctionPointY +
          3 * Math.pow(1 - t, 2) * t * this._controlY +
          3 * (1 - t) * Math.pow(t, 2) * this._controlY +
          Math.pow(t, 3) * this.targetY

        return Math.abs(labelY - y) < 1
      })
  }

  get _additionalControlY() {
    return this.sourceY * 0.7 + this.targetY * 0.3
  }

  get _junctionPointX() {
    return this._sourceControlX * 0.25 + this.sourceX * 0.75
  }

  get _junctionPointY() {
    return this._controlY * 0.25 + this._additionalControlY * 0.75
  }

  get _sourceControlX() {
    return (
      this._startAndEnd.start.x +
      (this._startAndEnd.isPointingToRight ? 150 : -150)
    )
  }
}
