const DistanceToShift = 8
const MinimumDistance = DistanceToShift * 3

export default function (
  sourceEntity,
  targetEntity,
  alingSourceBollards,
  alignTargetBollards
) {
  // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
  // hovering will not move the entity left or right.
  const isSourceJettyDeployed =
    sourceEntity.width / 2 >= MinimumDistance ||
    (sourceEntity.hasMultipleEndpoints && alingSourceBollards)

  const isTargetJettyDeployed =
    targetEntity.width / 2 >= MinimumDistance ||
    (targetEntity.hasMultipleEndpoints && alignTargetBollards)

  const centerOfSource = sourceEntity.center
  const centerOfTarget = targetEntity.center

  // Shift only when the entity has enough width to shift the endpoint.
  const leftTarget = isTargetJettyDeployed
    ? centerOfTarget - DistanceToShift * 3
    : centerOfTarget
  const leftSource = isSourceJettyDeployed
    ? centerOfSource - DistanceToShift
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
    return {
      source: rightSource,
      target: rightSource < leftTarget ? leftTarget : rightTarget
    }
  } else if (centerOfTarget < centerOfSource) {
    return {
      source: leftSource,
      target: leftSource < rightTarget ? leftTarget : rightTarget
    }
  }

  return { source: centerOfSource, target: centerOfTarget }
}
