import XPosition from './XPosition'

/**
 *
 * @param {import('../../../../../../../EntityModel').default} sourceEntity
 * @param {import('../../../../../../../EntityModel').default} targetEntity
 * @returns
 */
export default function (
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
      ? offsetBottomOfContainer - 3
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

  const centerOfSource = sourceEntity.offsetCenter
  const centerOfTarget = targetEntity.offsetCenter

  if (sourceEntity.offsetCenter === targetEntity.offsetCenter) {
    return [
      { y: sourceY, x: sourceEntity.offsetCenter, anchor: 'center' },
      { y: targetY, x: targetEntity.offsetCenter, anchor: 'center' }
    ]
  }

  if (sourceY < targetY) {
    const sourceAnchor =
      sourceEntity.offsetCenter < targetEntity.offsetCenter ? 'right' : 'left'
    const targetAnchor =
      anchorPositions.source[sourceAnchor] < targetEntity.offsetCenter
        ? 'left'
        : 'right'

    return [
      {
        y: sourceY,
        x: anchorPositions.source[sourceAnchor],
        anchor: sourceAnchor
      },
      {
        y: targetY,
        x: anchorPositions.target[targetAnchor],
        anchor: targetAnchor
      }
    ]
  } else if (sourceY > targetY) {
    const targetAnchor = centerOfSource < centerOfTarget ? 'left' : 'right'
    const target = new XPosition(
      anchorPositions.target[targetAnchor],
      targetAnchor
    )

    const sourceAnchor = target.x < centerOfSource ? 'left' : 'right'
    const source = new XPosition(
      anchorPositions.source[sourceAnchor],
      sourceAnchor
    )

    return [
      { y: sourceY, ...source },
      { y: targetY, ...target }
    ]
  } else {
    // When the source and target entities have the same height
    // Prevent source and target X coordinates from being swapped.
    if (centerOfSource < centerOfTarget) {
      const targetAnchor =
        anchorPositions.source.right < anchorPositions.target.left
          ? 'left'
          : 'right'

      const source = new XPosition(anchorPositions.source.right, 'right')
      const target = new XPosition(
        anchorPositions.target.targetAnchor,
        targetAnchor
      )

      return [
        { y: sourceY, ...source },
        { y: targetY, ...target }
      ]
    } else if (centerOfTarget < centerOfSource) {
      const targetAnchor =
        anchorPositions.source.left < anchorPositions.target.right
          ? 'left'
          : 'right'

      const source = new XPosition(anchorPositions.source.left, 'left')
      const target = new XPosition(
        anchorPositions.target[targetAnchor],
        targetAnchor
      )

      return [
        { y: sourceY, ...source },
        { y: targetY, ...target }
      ]
    }
  }
}
