import { MarkerHeight } from '../../MarkerHeight'
import determineAnchorPositions from './determineAnchorPositions'
import getXPositions from './getXPositions'

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

  const anchorPostions = determineAnchorPositions(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards
  )

  const [source, target] = getXPositions(
    sourceEntity,
    targetEntity,
    sourceY,
    targetY,
    anchorPostions
  )

  return [
    { y: sourceY, ...source },
    { y: targetY, ...target }
  ]
}
