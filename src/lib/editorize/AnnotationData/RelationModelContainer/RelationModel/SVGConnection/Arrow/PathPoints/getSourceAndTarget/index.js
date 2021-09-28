import { MarkerHeight } from '../../MarkerHeight'
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

  const [source, target] = getXPositions(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards
  )

  return [
    { y: sourceY, ...source },
    { y: targetY, ...target }
  ]
}
