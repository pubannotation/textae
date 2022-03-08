import XPosition from './determineXPositions/XPosition'

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

  let source
  let target

  const centerOfSource = anchorPositions.source.center
  const centerOfTarget = anchorPositions.target.center

  if (centerOfSource === centerOfTarget) {
    return [
      new XPosition(anchorPositions, 'source', 'center'),
      new XPosition(anchorPositions, 'target', 'center')
    ]
  }

  if (sourceY < targetY) {
    const sourceAnchor = centerOfSource < centerOfTarget ? 'right' : 'left'
    source = new XPosition(anchorPositions, 'source', sourceAnchor)

    const targetAnchor = source.x < centerOfTarget ? 'left' : 'right'
    target = new XPosition(anchorPositions, 'target', targetAnchor)
  } else if (sourceY > targetY) {
    const targetAnchor = centerOfSource < centerOfTarget ? 'left' : 'right'
    target = new XPosition(anchorPositions, 'target', targetAnchor)

    const sourceAnchor = target.x < centerOfSource ? 'left' : 'right'
    source = new XPosition(anchorPositions, 'source', sourceAnchor)
  } else {
    // When the source and target entities have the same height
    // Prevent source and target X coordinates from being swapped.
    if (centerOfSource < centerOfTarget) {
      const targetAnchor =
        anchorPositions.source.right < anchorPositions.target.left
          ? 'left'
          : 'right'

      source = new XPosition(anchorPositions, 'source', 'right')
      target = new XPosition(anchorPositions, 'target', targetAnchor)
    } else if (centerOfTarget < centerOfSource) {
      const targetAnchor =
        anchorPositions.source.left < anchorPositions.target.right
          ? 'left'
          : 'right'

      source = new XPosition(anchorPositions, 'source', 'left')
      target = new XPosition(anchorPositions, 'target', targetAnchor)
    }
  }

  return [
    { y: sourceY, ...source },
    { y: targetY, ...target }
  ]
}
