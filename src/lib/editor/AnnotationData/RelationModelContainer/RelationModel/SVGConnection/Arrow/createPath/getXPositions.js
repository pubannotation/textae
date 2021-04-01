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

  // Shift if the source and target positions are not swapped.
  if (centerOfSource < centerOfTarget) {
    if (isBold || rightSource < leftTarget) {
      return {
        source: rightSource,
        target: leftTarget
      }
    }
  } else if (centerOfTarget < centerOfSource) {
    if (isBold || rightTarget < leftSource) {
      return {
        source: leftSource,
        target: rightTarget
      }
    }
  }

  return { source: centerOfSource, target: centerOfTarget }
}
