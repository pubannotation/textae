const DistanceToShift = 8
const MinimumDistance = DistanceToShift * 3

export default function (
  isBold,
  sourceEndpoint,
  targetEndpoint,
  annotationBox
) {
  const hasSourceEnoughWidth =
    isBold || MinimumDistance <= sourceEndpoint.width / 2
  const hasTaregtEntityWidth =
    isBold || MinimumDistance <= targetEndpoint.width / 2

  const centerOfSource =
    sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
  const centerOfTarget =
    targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left

  // Shift only when the entity has enough width to shift the endpoint.
  const leftTarget = hasTaregtEntityWidth
    ? centerOfTarget - DistanceToShift * 3
    : centerOfTarget
  const leftSource = hasSourceEnoughWidth
    ? centerOfSource - DistanceToShift
    : centerOfSource
  const rightTarget = hasTaregtEntityWidth
    ? centerOfTarget + DistanceToShift
    : centerOfTarget
  const rightSource = hasSourceEnoughWidth
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
      target: rightTarget < leftSource ? rightTarget : leftTarget
    }
  }

  return { source: centerOfSource, target: centerOfTarget }
}
