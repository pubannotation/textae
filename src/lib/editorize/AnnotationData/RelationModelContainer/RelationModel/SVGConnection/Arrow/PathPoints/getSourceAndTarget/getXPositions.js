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
      { x: centerOfSource, anchor: 'center' },
      { x: centerOfTarget, anchor: 'center' }
    ]
  }

  if (sourceY < targetY) {
    const sourceAnchor = centerOfSource < centerOfTarget ? 'right' : 'left'
    const source = {
      anchor: sourceAnchor,
      x: anchorPositions.source[sourceAnchor]
    }

    const targetAnchor = source.x < centerOfTarget ? 'left' : 'right'
    const target = {
      anchor: targetAnchor,
      x: anchorPositions.target[targetAnchor]
    }

    return [source, target]
  } else if (sourceY > targetY) {
    const targetAnchor = centerOfSource < centerOfTarget ? 'left' : 'right'
    const target = {
      anchor: targetAnchor,
      x: anchorPositions.target[targetAnchor]
    }

    const sourceAnchor = target.x < centerOfSource ? 'left' : 'right'
    const source = {
      anchr: sourceAnchor,
      x: anchorPositions.source[sourceAnchor]
    }

    return [source, target]
  } else {
    // When the source and target entities have the same height
    // Prevent source and target X coordinates from being swapped.
    if (centerOfSource < centerOfTarget) {
      const targetAnchor =
        anchorPositions.source.right < anchorPositions.target.left
          ? 'left'
          : 'right'

      return [
        {
          anchor: 'right',
          x: anchorPositions.source.right
        },
        {
          anchor: targetAnchor,
          x: anchorPositions.target[targetAnchor]
        }
      ]
    } else if (centerOfTarget < centerOfSource) {
      const targetAnchor =
        anchorPositions.source.left < anchorPositions.target.right
          ? 'left'
          : 'right'

      return [
        { anchor: 'left', x: anchorPositions.source.left },
        {
          anchor: targetAnchor,
          x: anchorPositions.target[targetAnchor]
        }
      ]
    }
  }
}
