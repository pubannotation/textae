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
    const source =
      centerOfSource < centerOfTarget
        ? {
            x: anchorPositions.source.right,
            anchor: 'right'
          }
        : {
            x: anchorPositions.source.left,
            anchor: 'left'
          }
    const target = {
      x:
        source.x < centerOfTarget
          ? anchorPositions.target.left
          : anchorPositions.target.right,
      anchro: source.x < centerOfTarget ? 'left' : 'right'
    }

    return [source, target]
  } else if (sourceY > targetY) {
    const target =
      centerOfSource < centerOfTarget
        ? {
            x: anchorPositions.target.left,
            anchor: 'left'
          }
        : { x: anchorPositions.target.right, anchor: 'right' }
    const source = {
      x:
        target.x < centerOfSource
          ? anchorPositions.source.left
          : anchorPositions.source.right,
      anchr: target.x < centerOfSource ? 'left' : 'right'
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
