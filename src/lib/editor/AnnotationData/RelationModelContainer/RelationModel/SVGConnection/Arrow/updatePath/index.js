import getPathPoints from './getPathPoints'

export default function (
  path,
  annotationBox,
  sourceEntity,
  targetEntity,
  color,
  isBold
) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    targetControlX,
    controlY
  } = getPathPoints(annotationBox, sourceEntity, targetEntity, isBold)

  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceControlX} ${controlY}, ${targetControlX} ${controlY}, ${targetX} ${targetY}`
  )

  path.setAttribute('style', `stroke: ${color};`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }

  return {
    sourceY,
    targetY,
    controlY,
    sourceX,
    targetX,
    sourceControlX,
    targetControlX
  }
}
