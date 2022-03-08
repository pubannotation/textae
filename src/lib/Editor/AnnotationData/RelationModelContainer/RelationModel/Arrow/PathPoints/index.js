import { MarkerHeight } from '../MarkerHeight'

class PathPoints {
  /**
   *
   * @param {boolean} alignSourceBollards
   * @param {boolean} alignTargetBollards
   * @param {number} clientTopOfContainer
   * @param {number} column
   */
  constructor(
    sourceAndTarget,
    alignSourceBollards,
    alignTargetBollards,
    controlBarHeight,
    clientTopOfContainer
  ) {
    const { source, target } = sourceAndTarget

    const controlY =
      sourceAndTarget.offsetTop -
      sourceAndTarget.horizontalDistance / 4 -
      20 +
      (alignSourceBollards && alignTargetBollards ? 3 : 0)

    this._controlY = controlY

    this._sourceAndTarget = sourceAndTarget

    this._controlBarHeight = controlBarHeight
    this._clientTopOfContainer = clientTopOfContainer
  }

  get sourceX() {
    return this._sourceAndTarget.source.x
  }
  get targetX() {
    return this._sourceAndTarget.target.x
  }

  get sourceY() {
    return this._sourceAndTarget.source.y - MarkerHeight
  }
  get targetY() {
    return this._sourceAndTarget.target.y - MarkerHeight
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
    return this._sourceAndTarget.source.x
  }

  get _targetControlX() {
    return this._sourceAndTarget.target.x
  }
}

export class ArchedPathPoints extends PathPoints {}

export class PointingDownPathPoints extends PathPoints {
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

  // No emphasis on relation.
  get isCalm() {
    return true
  }
}

export class BentOnSourcePathPoints extends PathPoints {
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
      this._sourceAndTarget.source.x +
      (this._sourceAndTarget.target.anchor === 'right' ? 150 : -150)
    )
  }
}

export class BentOnTargetPathPoints extends PathPoints {
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
      this._sourceAndTarget.target.x +
      (this._sourceAndTarget.source.anchor === 'right' ? 150 : -150)
    )
  }
}
