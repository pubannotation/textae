import { MarkerHeight } from '../../MarkerHeight'
import determineAnchorPositions from './determineAnchorPositions'
import determineXPositions from './determineXPositions'

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards
) {
  const sourceY =
    sourceEntity.top - MarkerHeight - (alignSourceBollards ? 3 : 0)
  const targetY =
    targetEntity.top - MarkerHeight - (alignTargetBollards ? 3 : 0)

  const anchorPositions = determineAnchorPositions(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards
  )

  const [source, target] = determineXPositions(
    sourceY,
    targetY,
    anchorPositions
  )

  return [
    { y: sourceY, ...source },
    { y: targetY, ...target }
  ]
}
