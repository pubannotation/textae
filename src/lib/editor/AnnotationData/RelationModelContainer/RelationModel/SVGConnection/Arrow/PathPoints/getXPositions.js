const DistanceToShift = 8
const MinimumDistance = DistanceToShift * 3

export default function (sourceEntity, targetEntity, isBold) {
  // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
  // hovering will not move the entity left or right.
  const foldUpSourceJetty =
    sourceEntity.width / 2 < MinimumDistance &&
    (!isBold || sourceEntity.relations.length === 1)

  const foldUpTargetJetty =
    targetEntity.width / 2 < MinimumDistance &&
    (!isBold || targetEntity.relations.length === 1)

  const centerOfSource = sourceEntity.center
  const centerOfTarget = targetEntity.center

  // Shift only when the entity has enough width to shift the endpoint.
  const leftTarget = foldUpTargetJetty
    ? centerOfTarget
    : centerOfTarget - DistanceToShift * 3
  const leftSource = foldUpSourceJetty
    ? centerOfSource
    : centerOfSource - DistanceToShift
  const rightTarget = foldUpTargetJetty
    ? centerOfTarget
    : centerOfTarget + DistanceToShift
  const rightSource = foldUpSourceJetty
    ? centerOfSource
    : centerOfSource + DistanceToShift * 3

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
      target: leftSource < rightTarget ? rightTarget : leftTarget
    }
  }

  return { source: centerOfSource, target: centerOfTarget }
}
