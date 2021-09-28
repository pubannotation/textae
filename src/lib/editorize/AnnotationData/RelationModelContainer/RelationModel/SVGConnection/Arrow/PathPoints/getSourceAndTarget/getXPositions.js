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
      x: anchorPositions.source[sourceAnchor],
      anchor: sourceAnchor
    }

    const targetAnchor = source.x < centerOfTarget ? 'left' : 'right'
    const target = {
      x: anchorPositions.target[targetAnchor],
      anchor: targetAnchor
    }

    return [source, target]
  } else if (sourceY > targetY) {
    const targetAnchor = centerOfSource < centerOfTarget ? 'left' : 'right'
    const target = {
      x: anchorPositions.target[targetAnchor],
      anchor: targetAnchor
    }

    const sourceAnchor = target.x < centerOfSource ? 'left' : 'right'
    const source = {
      x: anchorPositions.source[sourceAnchor],
      anchr: sourceAnchor
    }

    return [source, target]
  } else {
    // When the source and target entities have the same height
    // Prevent source and target X coordinates from being swapped.
    if (centerOfSource < centerOfTarget) {
      return [
        {
          x: anchorPositions.source.right,
          anchor: 'right'
        },
        {
          x:
            anchorPositions.source.right < anchorPositions.target.left
              ? anchorPositions.target.left
              : anchorPositions.target.right,
          anchro:
            anchorPositions.source.right < anchorPositions.target.left
              ? 'left'
              : 'right'
        }
      ]
    } else if (centerOfTarget < centerOfSource) {
      return [
        { x: anchorPositions.source.left, anchor: 'left' },
        {
          x:
            anchorPositions.source.left < anchorPositions.target.right
              ? anchorPositions.target.left
              : anchorPositions.target.right,
          anchor:
            anchorPositions.source.left < anchorPositions.target.right
              ? 'left'
              : 'right'
        }
      ]
    }
  }
}
