import { MinimumDistance, DistanceToShift } from './determineXPositions'

function getAnchorPosition(entity, alignBollards) {
  // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
  // hovering will not move the entity left or right.
  const isSourceJettyDeployed =
    entity.width / 2 >= MinimumDistance ||
    (entity.hasMultipleEndpoints && alignBollards)

  const centerOfSource = entity.offsetCenter
  const leftSource = isSourceJettyDeployed
    ? centerOfSource - DistanceToShift * 3
    : centerOfSource
  const rightSource = isSourceJettyDeployed
    ? centerOfSource + DistanceToShift * 3
    : centerOfSource

  return { left: leftSource, right: rightSource, center: centerOfSource }
}

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards
) {
  return {
    source: getAnchorPosition(sourceEntity, alignSourceBollards),
    target: getAnchorPosition(targetEntity, alignTargetBollards)
  }
}
