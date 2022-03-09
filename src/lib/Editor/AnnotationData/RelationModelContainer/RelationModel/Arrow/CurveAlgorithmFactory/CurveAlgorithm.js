import { MarkerHeight } from '../MarkerHeight'

export default class CurveAlgorithm {
  /**
   * @param {import('./StartAndEnd').startAndEnd} startAndEnd
   * @param {boolean} alignSourceBollards
   * @param {boolean} alignTargetBollards
   * @param {number} clientTopOfContainer
   * @param {number} column
   */
  constructor(
    startAndEnd,
    alignSourceBollards,
    alignTargetBollards,
    controlBarHeight,
    clientTopOfContainer
  ) {
    this._controlY =
      startAndEnd.offsetTop -
      startAndEnd.horizontalDistance / 4 -
      20 +
      (alignSourceBollards && alignTargetBollards ? 3 : 0)
    this._startAndEnd = startAndEnd
    this._controlBarHeight = controlBarHeight
    this._clientTopOfContainer = clientTopOfContainer
  }

  get sourceX() {
    return this._startAndEnd.start.x
  }
  get targetX() {
    return this._startAndEnd.end.x
  }

  get sourceY() {
    return this._startAndEnd.start.y - MarkerHeight
  }
  get targetY() {
    return this._startAndEnd.end.y - MarkerHeight
  }

  get pathCommands() {
    return `M ${this.sourceX}, ${this.sourceY}
            C ${this._sourceControlX} ${this._controlY}, ${this._targetControlX} ${this._controlY}, ${this.targetX} ${this.targetY}`
  }

  get transformDefinitionsForSourceTriangle() {
    return `translate(${this.sourceX}, ${this.sourceY})`
  }

  get transformDefinitionsForTargetTriangle() {
    return `translate(${this.targetX}, ${this.targetY})`
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
          Math.pow(t, 3) * this.targetY
        return Math.abs(labelY - y) < 1
      })
  }

  getXOnT(_t) {
    const {
      sourceX,
      targetX,
      _sourceControlX: sourceControlX,
      _targetControlX: targetControlX
    } = this

    return (
      Math.pow(1 - _t, 3) * sourceX +
      3 * Math.pow(1 - _t, 2) * _t * sourceControlX +
      3 * (1 - _t) * Math.pow(_t, 2) * targetControlX +
      Math.pow(_t, 3) * targetX
    )
  }

  get _sourceControlX() {
    return this._startAndEnd.start.x
  }

  get _targetControlX() {
    return this._startAndEnd.end.x
  }
}
