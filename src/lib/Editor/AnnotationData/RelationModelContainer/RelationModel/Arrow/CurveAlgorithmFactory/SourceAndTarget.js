export default class SourceAndTarget {
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

    if (sourceEntity.offsetCenter === targetEntity.offsetCenter) {
      this._source = {
        y: sourceY,
        x: sourceEntity.offsetCenter,
        anchor: 'center'
      }
      this._target = {
        y: targetY,
        x: targetEntity.offsetCenter,
        anchor: 'center'
      }
      return
    }

    if (sourceY < targetY) {
      const sourceAnchor =
        sourceEntity.offsetCenter < targetEntity.offsetCenter ? 'right' : 'left'
      const targetAnchor =
        anchorPositions.source[sourceAnchor] < targetEntity.offsetCenter
          ? 'left'
          : 'right'

      this._source = {
        y: sourceY,
        x: anchorPositions.source[sourceAnchor],
        anchor: sourceAnchor
      }
      this._target = {
        y: targetY,
        x: anchorPositions.target[targetAnchor],
        anchor: targetAnchor
      }
      return
    } else if (sourceY > targetY) {
      const targetAnchor =
        sourceEntity.offsetCenter < targetEntity.offsetCenter ? 'left' : 'right'
      const sourceAnchor =
        anchorPositions.target[targetAnchor] < sourceEntity.offsetCenter
          ? 'left'
          : 'right'

      this._source = {
        y: sourceY,
        x: anchorPositions.source[sourceAnchor],
        anchor: sourceAnchor
      }
      this._target = {
        y: targetY,
        x: anchorPositions.target[targetAnchor],
        anchor: targetAnchor
      }
      return
    } else {
      // When the source and target entities have the same height
      // Prevent source and target X coordinates from being swapped.
      if (sourceEntity.offsetCenter < targetEntity.offsetCenter) {
        const targetAnchor =
          anchorPositions.source.right < anchorPositions.target.left
            ? 'left'
            : 'right'

        this._source = {
          y: sourceY,
          x: anchorPositions.source.right,
          anchor: 'right'
        }
        this._target = {
          y: targetY,
          x: anchorPositions.target[targetAnchor],
          anchor: targetAnchor
        }
        return
      } else if (sourceEntity.offsetCenter > targetEntity.offsetCenter) {
        const targetAnchor =
          anchorPositions.source.left < anchorPositions.target.right
            ? 'left'
            : 'right'

        this._source = {
          y: sourceY,
          x: anchorPositions.source.left,
          anchor: 'left'
        }
        this._target = {
          y: targetY,
          x: anchorPositions.target[targetAnchor],
          anchor: targetAnchor
        }
        return
      }
    }
  }

  get source() {
    return this._source
  }

  get target() {
    return this._target
  }

  get isDownward() {
    return this._source.y < this._target.y
  }

  get offsetTop() {
    return Math.min(this._source.y, this._target.y)
  }

  get horizontalDistance() {
    return Math.abs(this._target.x - this._source.x)
  }
}
