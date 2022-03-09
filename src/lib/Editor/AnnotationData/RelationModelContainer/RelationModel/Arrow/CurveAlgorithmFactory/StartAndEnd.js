export default class startAndEnd {
  /**
   *
   * @param {import('../../../../../../../EntityModel').default} sourceEntity
   * @param {import('../../../../../../../EntityModel').default} targetEntity
   * @returns
   */
  constructor(relation, alignSourceBollards, alignTargetBollards) {
    this._relation = relation
    this._sourceEntity = relation.sourceEntity
    this._targetEntity = relation.targetEntity

    const sourceY = this._sourceEntity.offsetTop - (alignSourceBollards ? 3 : 0)
    const targetY = this._targetEntity.offsetTop - (alignTargetBollards ? 3 : 0)

    const sourceAnchorPosition =
      this._sourceEntity.getSourceAnchorPosition(alignSourceBollards)
    const targetAnchorPosition =
      this._targetEntity.getTargetAnchorPosition(alignTargetBollards)

    if (this._sourceEntity.offsetCenter === this._targetEntity.offsetCenter) {
      this._start = {
        y: sourceY,
        x: this._sourceEntity.offsetCenter
      }
      this._end = {
        y: targetY,
        x: this._targetEntity.offsetCenter
      }
      return
    }

    if (sourceY < targetY) {
      const sourceAnchor = this.isPointingToRight ? 'right' : 'left'
      const targetAnchor =
        sourceAnchorPosition[sourceAnchor] < this._targetEntity.offsetCenter
          ? 'left'
          : 'right'

      this._start = {
        y: sourceY,
        x: sourceAnchorPosition[sourceAnchor]
      }
      this._end = {
        y: targetY,
        x: targetAnchorPosition[targetAnchor]
      }
      return
    } else if (sourceY > targetY) {
      const targetAnchor = this.isPointingToRight ? 'left' : 'right'
      const sourceAnchor =
        targetAnchorPosition[targetAnchor] < this._sourceEntity.offsetCenter
          ? 'left'
          : 'right'

      this._start = {
        y: sourceY,
        x: sourceAnchorPosition[sourceAnchor]
      }
      this._end = {
        y: targetY,
        x: targetAnchorPosition[targetAnchor]
      }
      return
    } else {
      // When the source and target entities have the same height
      // Prevent source and target X coordinates from being swapped.
      if (this.isPointingToRight) {
        const targetAnchor =
          sourceAnchorPosition.right < targetAnchorPosition.left
            ? 'left'
            : 'right'

        this._start = {
          y: sourceY,
          x: sourceAnchorPosition.right
        }
        this._end = {
          y: targetY,
          x: targetAnchorPosition[targetAnchor]
        }
        return
      } else {
        const targetAnchor =
          sourceAnchorPosition.left < targetAnchorPosition.right
            ? 'left'
            : 'right'

        this._start = {
          y: sourceY,
          x: sourceAnchorPosition.left
        }
        this._end = {
          y: targetY,
          x: targetAnchorPosition[targetAnchor]
        }
        return
      }
    }
  }

  get start() {
    return this._start
  }

  get end() {
    return this._end
  }

  get isPointingToRight() {
    return this._sourceEntity.offsetCenter < this._targetEntity.offsetCenter
  }

  get isDownward() {
    return this._start.y < this._end.y
  }

  get offsetTop() {
    return Math.min(this._start.y, this._end.y)
  }

  get horizontalDistance() {
    return Math.abs(this._end.x - this._start.x)
  }
}
