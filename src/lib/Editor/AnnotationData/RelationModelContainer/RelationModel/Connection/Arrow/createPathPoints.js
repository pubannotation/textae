import PathPoints from './PathPoints'

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards,
  clientTopOfContainer,
  controlBarHeight
) {
  return new PathPoints(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer,
    controlBarHeight
  )
}
