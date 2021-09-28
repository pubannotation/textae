const DistanceToShift = 8
// Leave a gap half the width of the triangle so that the triangle does not intersect the vertical line.
const MinimumDistance = DistanceToShift * 3 + 4

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards
) {
  // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
  // hovering will not move the entity left or right.
  const isSourceJettyDeployed =
    sourceEntity.width / 2 >= MinimumDistance ||
    (sourceEntity.hasMultipleEndpoints && alignSourceBollards)

  const isTargetJettyDeployed =
    targetEntity.width / 2 >= MinimumDistance ||
    (targetEntity.hasMultipleEndpoints && alignTargetBollards)

  const centerOfSource = sourceEntity.center
  const centerOfTarget = targetEntity.center

  // Shift only when the entity has enough width to shift the endpoint.
  const leftTarget = isTargetJettyDeployed
    ? centerOfTarget - DistanceToShift
    : centerOfTarget
  const leftSource = isSourceJettyDeployed
    ? centerOfSource - DistanceToShift * 3
    : centerOfSource
  const rightTarget = isTargetJettyDeployed
    ? centerOfTarget + DistanceToShift
    : centerOfTarget
  const rightSource = isSourceJettyDeployed
    ? centerOfSource + DistanceToShift * 3
    : centerOfSource

  // When the left and right positions of the entities are close
  // and the left and right positions of the endpoints are opposite to the left and right positions of the entities,
  //  move the endpoints to the source side.
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

  return [
    { x: centerOfSource, anchor: 'center' },
    { x: centerOfTarget, anchor: 'center' }
  ]
}
