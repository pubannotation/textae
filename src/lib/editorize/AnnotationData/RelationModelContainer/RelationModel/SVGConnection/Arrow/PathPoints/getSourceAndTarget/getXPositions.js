import determineAnchorPositions from './determineAnchorPositions'

export const DistanceToShift = 8
// Leave a gap half the width of the triangle so that the triangle does not intersect the vertical line.
export const MinimumDistance = DistanceToShift * 3 + 4

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards,
  sourceY,
  targetY
) {
  const { leftTarget, leftSource, rightTarget, rightSource } =
    determineAnchorPositions(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards
    )
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
            x: rightSource,
            anchor: 'right'
          }
        : {
            x: leftSource,
            anchor: 'left'
          }
    const target = {
      x: source.x < centerOfTarget ? leftTarget : rightTarget,
      anchro: source.x < centerOfTarget ? 'left' : 'right'
    }

    return [source, target]
  } else if (sourceY > targetY) {
    const target =
      centerOfSource < centerOfTarget
        ? {
            x: leftTarget,
            anchor: 'left'
          }
        : { x: rightTarget, anchor: 'right' }
    const source = {
      x: target.x < centerOfSource ? leftSource : rightSource,
      anchr: target.x < centerOfSource ? 'left' : 'right'
    }
    return [source, target]
  } else {
    // When the source and target entities have the same height
    // Prevent source and target X coordinates from being swapped.
    if (centerOfSource < centerOfTarget) {
      return [
        {
          x: rightSource,
          anchor: 'right'
        },
        {
          x: rightSource < leftTarget ? leftTarget : rightTarget,
          anchro: rightSource < leftTarget ? 'left' : 'right'
        }
      ]
    } else if (centerOfTarget < centerOfSource) {
      return [
        { x: leftSource, anchor: 'left' },
        {
          x: leftSource < rightTarget ? leftTarget : rightTarget,
          anchor: leftSource < rightTarget ? 'left' : 'right'
        }
      ]
    }
  }
}
