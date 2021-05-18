const DistanceToShift = 8
const MinimumDistance = DistanceToShift * 3

export default function (isBold, sourceEntity, targetEntity, annotationBox) {
  const sourceEndpoint = sourceEntity.clientRect
  const targetEndpoint = targetEntity.clientRect

  // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
  // hovering will not move the entity left or right.
  const combineSourceEndpoints =
    sourceEndpoint.width / 2 < MinimumDistance &&
    (!isBold || sourceEntity.relations.length === 1)

  const combineTargetEndpoints =
    targetEndpoint.width / 2 < MinimumDistance &&
    (!isBold || targetEntity.relations.length === 1)

  const centerOfSource =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const centerOfTarget =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left

  // Shift only when the entity has enough width to shift the endpoint.
  const leftTarget = combineTargetEndpoints
    ? centerOfTarget
    : centerOfTarget - DistanceToShift * 3
  const leftSource = combineSourceEndpoints
    ? centerOfSource
    : centerOfSource - DistanceToShift
  const rightTarget = combineTargetEndpoints
    ? centerOfTarget
    : centerOfTarget + DistanceToShift
  const rightSource = combineSourceEndpoints
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
