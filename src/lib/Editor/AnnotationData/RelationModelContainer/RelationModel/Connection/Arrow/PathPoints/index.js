import getSourceAndTarget from './getSourceAndTarget'

export default class PathPoints {
  /**
   *
   * @param {import('./../../../../../../EntityModel').default} sourceEntity
   * @param {import('./../../../../../../EntityModel').default} targetEntity
   * @param {boolean} alignSourceBollards
   * @param {boolean} alignTargetBollards
   * @param {number} clientTopOfContainer
   * @param {number} column
   */
  constructor(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer,
    controlBarHeight
  ) {
    const [source, target] = getSourceAndTarget(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards,
      clientTopOfContainer
    )

    const controlY =
      Math.min(source.y, target.y) -
      Math.abs(target.x - source.x) / 4 -
      20 +
      (alignSourceBollards && alignTargetBollards ? 3 : 0)

    this._controlY = controlY
    this._source = source
    this._target = target
    this._sourceEntity = sourceEntity
    this._targetEntity = targetEntity
  }

  get sourceX() {
    return this._source.x
  }
  get targetX() {
    return this._target.x
  }

  get sourceY() {
    return this._source.y
  }
  get targetY() {
    return this._target.y
  }

  get pathCommands() {
    if (this._isBentOnTargetSide) {
      return `M ${this.sourceX}, ${this.sourceY}
              C ${this._sourceControlX} ${this._controlY}, ${this._targetControlX} ${this._controlY}, ${this._junctionPointX} ${this._junctionPointY}
              Q ${this.targetX} ${this._additionalControlY}, ${this.targetX} ${this.targetY}`
    }

    if (this._isBentOnSourceSide) {
      return `M ${this.sourceX}, ${this.sourceY}
              Q ${this.sourceX} ${this._additionalControlY}, ${this._junctionPointX} ${this._junctionPointY}
              C ${this._sourceControlX} ${this._controlY}, ${this._targetControlX} ${this._controlY}, ${this.targetX} ${this.targetY}`
    }

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
    const { sourceY, targetY, _controlY: controlY } = this

    if (this._isBentOnTargetSide) {
      return [...Array(sample).keys()]
        .map((i) => (i * 1) / sample)
        .find((t) => {
          const labelY =
            Math.pow(1 - t, 3) * sourceY +
            3 * Math.pow(1 - t, 2) * t * controlY +
            3 * (1 - t) * Math.pow(t, 2) * controlY +
            Math.pow(t, 3) * this._junctionPointY
          return Math.abs(labelY - y) < 1
        })
    }

    if (this._isBentOnSourceSide) {
      return [...Array(sample).keys()]
        .map((i) => (i * 1) / sample)
        .find((t) => {
          const labelY =
            Math.pow(1 - t, 3) * this._junctionPointY +
            3 * Math.pow(1 - t, 2) * t * controlY +
            3 * (1 - t) * Math.pow(t, 2) * controlY +
            Math.pow(t, 3) * targetY

          return Math.abs(labelY - y) < 1
        })
    }

    return [...Array(sample).keys()]
      .map((i) => (i * 1) / sample)
      .find((t) => {
        const labelY =
          Math.pow(1 - t, 3) * sourceY +
          3 * Math.pow(1 - t, 2) * t * controlY +
          3 * (1 - t) * Math.pow(t, 2) * controlY +
          Math.pow(t, 3) * targetY
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

    if (this._isBentOnTargetSide) {
      return (
        Math.pow(1 - _t, 3) * sourceX +
        3 * Math.pow(1 - _t, 2) * _t * sourceControlX +
        3 * (1 - _t) * Math.pow(_t, 2) * targetControlX +
        Math.pow(_t, 3) * this._junctionPointX
      )
    }

    return (
      Math.pow(1 - _t, 3) * sourceX +
      3 * Math.pow(1 - _t, 2) * _t * sourceControlX +
      3 * (1 - _t) * Math.pow(_t, 2) * targetControlX +
      Math.pow(_t, 3) * targetX
    )
  }

  get _additionalControlY() {
    if (this._isBentOnTargetSide) {
      return this.sourceY * 0.3 + this.targetY * 0.7
    }

    if (this._isBentOnSourceSide) {
      return this.sourceY * 0.7 + this.targetY * 0.3
    }

    throw new Error('No additional control point!')
  }

  get _junctionPointX() {
    if (this._isBentOnTargetSide) {
      return this._targetControlX * 0.25 + this.targetX * 0.75
    }

    if (this._isBentOnSourceSide) {
      return this._sourceControlX * 0.25 + this.sourceX * 0.75
    }

    throw new Error('No junction point!')
  }

  get _junctionPointY() {
    if (this._isBentOnTargetSide) {
      return this._controlY * 0.25 + this._additionalControlY * 0.75
    }

    if (this._isBentOnSourceSide) {
      return this._controlY * 0.25 + this._additionalControlY * 0.75
    }

    throw new Error('No junction point!')
  }

  get _sourceControlX() {
    if (this._isBentOnSourceSide) {
      return this._source.x + (this._target.anchor === 'right' ? 150 : -150)
    }
    return this._source.x
  }

  get _targetControlX() {
    if (this._isBentOnTargetSide) {
      return this._target.x + (this._source.anchor === 'right' ? 150 : -150)
    }
    return this._target.x
  }

  get _isBentOnSourceSide() {
    if (
      Math.abs(
        this._sourceEntity.clientBottom - this._targetEntity.clientBottom
      ) < 12 ||
      42 < Math.abs(this._target.x - this._source.x)
    ) {
      return false
    }

    if (this._source.y < this._target.y) {
      return false
    } else {
      return true
    }
  }

  get _isBentOnTargetSide() {
    if (
      Math.abs(
        this._sourceEntity.clientBottom - this._targetEntity.clientBottom
      ) < 12 ||
      42 < Math.abs(this._target.x - this._source.x)
    ) {
      return false
    }

    if (this._source.y < this._target.y) {
      return true
    } else {
      return false
    }
  }
}
