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
  const { clientHeight } = document.documentElement
  const offsetBottomOfContainer = clientHeight - clientTopOfContainer
  const sourceTop =
    clientHeight < sourceEntity.clientTop
      ? offsetBottomOfContainer
      : sourceEntity.offsetTop
  const targetTop =
    clientHeight < targetEntity.clientTop
      ? offsetBottomOfContainer
      : targetEntity.offsetTop

  const sourceY = sourceTop - (alignSourceBollards ? 3 : 0)
  const targetY = targetTop - (alignTargetBollards ? 3 : 0)

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
