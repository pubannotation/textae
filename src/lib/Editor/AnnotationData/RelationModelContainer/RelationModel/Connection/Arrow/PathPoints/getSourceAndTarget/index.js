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
  clientTopOfContainer
) {
  const offsetBottomOfContainer =
    document.documentElement.clientHeight - clientTopOfContainer
  const sourceTop =
    sourceEntity.offsetTop > offsetBottomOfContainer
      ? offsetBottomOfContainer
      : sourceEntity.offsetTop
  const targetTop =
    targetEntity.offsetTop > offsetBottomOfContainer
      ? offsetBottomOfContainer
      : targetEntity.offsetTop

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
