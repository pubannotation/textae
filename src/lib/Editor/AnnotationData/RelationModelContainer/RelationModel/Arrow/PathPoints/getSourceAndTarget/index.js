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
      ? offsetBottomOfContainer - 3
      : sourceEntity.offsetTop
  const targetTop =
    clientHeight < targetEntity.clientTop
      ? offsetBottomOfContainer - 3
      : targetEntity.offsetTop

  const sourceY = sourceTop - (alignSourceBollards ? 3 : 0)
  const targetY = targetTop - (alignTargetBollards ? 3 : 0)

  const anchorPositions = {
    source: sourceEntity.getAnchorPosition(alignSourceBollards),
    target: targetEntity.getAnchorPosition(alignTargetBollards)
  }

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
