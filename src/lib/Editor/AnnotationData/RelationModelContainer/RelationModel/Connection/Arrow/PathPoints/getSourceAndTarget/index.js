import { MarkerHeight } from '../../MarkerHeight'
import determineAnchorPositions from './determineAnchorPositions'
import determineXPositions from './determineXPositions'

/**
 *
 * @param {import('../../../../../../../EntityModel').default} sourceEntity
 * @param {import('../../../../../../../EntityModel').default} targetEntity
 * @returns
 */
export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards,
  containerTop
) {
  const containerBottom = document.documentElement.clientHeight - containerTop
  const sourceTop =
    sourceEntity.top > containerBottom ? containerBottom : sourceEntity.top
  const targetTop =
    targetEntity.top > containerBottom ? containerBottom : targetEntity.top

  const sourceY = sourceTop - MarkerHeight - (alignSourceBollards ? 3 : 0)
  const targetY = targetTop - MarkerHeight - (alignTargetBollards ? 3 : 0)

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
