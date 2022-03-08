export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards
) {
  return {
    source: sourceEntity.getAnchorPosition(alignSourceBollards),
    target: targetEntity.getAnchorPosition(alignTargetBollards)
  }
}
