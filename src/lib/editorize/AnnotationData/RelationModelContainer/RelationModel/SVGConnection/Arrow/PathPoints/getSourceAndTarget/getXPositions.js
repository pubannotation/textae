import XPosition from './XPosition'

export const DistanceToShift = 8
// Leave a gap half the width of the triangle so that the triangle does not intersect the vertical line.
export const MinimumDistance = DistanceToShift * 3 + 4

export default function (
  sourceEntity,
  targetEntity,
  sourceY,
  targetY,
  anchorPositions
) {
  const centerOfSource = sourceEntity.center
  const centerOfTarget = targetEntity.center

  if (centerOfSource === centerOfTarget) {
    return [
      new XPosition(anchorPositions, 'source', 'center'),
      new XPosition(anchorPositions, 'target', 'center')
    ]
  }

  if (sourceY < targetY) {
    const sourceAnchor = centerOfSource < centerOfTarget ? 'right' : 'left'
    const source = new XPosition(anchorPositions, 'source', sourceAnchor)

    const targetAnchor = source.x < centerOfTarget ? 'left' : 'right'
    return [source, new XPosition(anchorPositions, 'target', targetAnchor)]
  } else if (sourceY > targetY) {
    const targetAnchor = centerOfSource < centerOfTarget ? 'left' : 'right'
    const target = new XPosition(anchorPositions, 'target', targetAnchor)

    const sourceAnchor = target.x < centerOfSource ? 'left' : 'right'
    return [new XPosition(anchorPositions, 'source', sourceAnchor), target]
  } else {
    // When the source and target entities have the same height
    // Prevent source and target X coordinates from being swapped.
    if (centerOfSource < centerOfTarget) {
      const targetAnchor =
        anchorPositions.source.right < anchorPositions.target.left
          ? 'left'
          : 'right'

      return [
        new XPosition(anchorPositions, 'source', 'right'),
        new XPosition(anchorPositions, 'target', targetAnchor)
      ]
    } else if (centerOfTarget < centerOfSource) {
      const targetAnchor =
        anchorPositions.source.left < anchorPositions.target.right
          ? 'left'
          : 'right'

      return [
        new XPosition(anchorPositions, 'source', 'left'),
        new XPosition(anchorPositions, 'target', targetAnchor)
      ]
    }
  }
}
