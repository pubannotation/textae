export default class startAndEnd {
  /**
   *
   * @param {import('../../../../../../../EntityModel').default} sourceEntity
   * @param {import('../../../../../../../EntityModel').default} targetEntity
   * @returns
   */
  constructor(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer
  ) {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - clientTopOfContainer

    const sourceTop =
      clientHeight < sourceEntity.clientTop
        ? offsetBottomOfContainer
        : sourceEntity.offsetTop

    const targetTop =
      clientHeight < targetEntity.clientTop
        ? offsetBottomOfContainer - 3
        : targetEntity.offsetTop

    const sourceY = sourceTop - (alignSourceBollards ? 3 : 0)
    const targetY = targetTop - (alignTargetBollards ? 3 : 0)

    const anchorPositions = {
      source: sourceEntity.getSourceAnchorPosition(alignSourceBollards),
      target: targetEntity.getTargetAnchorPosition(alignTargetBollards)
    }

    this._isPontingToRight =
      sourceEntity.offsetCenter < targetEntity.offsetCenter

    if (sourceEntity.offsetCenter === targetEntity.offsetCenter) {
      this._start = {
        y: sourceY,
        x: sourceEntity.offsetCenter
      }
      this._end = {
        y: targetY,
        x: targetEntity.offsetCenter
      }
      return
    }

    if (sourceY < targetY) {
      const sourceAnchor = this._isPontingToRight ? 'right' : 'left'
      const targetAnchor =
        anchorPositions.source[sourceAnchor] < targetEntity.offsetCenter
          ? 'left'
          : 'right'

      this._start = {
        y: sourceY,
        x: anchorPositions.source[sourceAnchor]
      }
      this._end = {
        y: targetY,
        x: anchorPositions.target[targetAnchor]
      }
      return
    } else if (sourceY > targetY) {
      const targetAnchor = this._isPontingToRight ? 'left' : 'right'
      const sourceAnchor =
        anchorPositions.target[targetAnchor] < sourceEntity.offsetCenter
          ? 'left'
          : 'right'

      this._start = {
        y: sourceY,
        x: anchorPositions.source[sourceAnchor]
      }
      this._end = {
        y: targetY,
        x: anchorPositions.target[targetAnchor]
      }
      return
    } else {
      // When the source and target entities have the same height
      // Prevent source and target X coordinates from being swapped.
      if (this._isPontingToRight) {
        const targetAnchor =
          anchorPositions.source.right < anchorPositions.target.left
            ? 'left'
            : 'right'

        this._start = {
          y: sourceY,
          x: anchorPositions.source.right
        }
        this._end = {
          y: targetY,
          x: anchorPositions.target[targetAnchor]
        }
        return
      } else {
        const targetAnchor =
          anchorPositions.source.left < anchorPositions.target.right
            ? 'left'
            : 'right'

        this._start = {
          y: sourceY,
          x: anchorPositions.source.left
        }
        this._end = {
          y: targetY,
          x: anchorPositions.target[targetAnchor]
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
    return this._isPontingToRight
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
