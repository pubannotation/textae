export default function (path, pathPoints, color, isBold) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    targetControlX,
    controlY
  } = pathPoints

  path.setAttribute(
    'd',
    `M ${sourceX}, ${sourceY} C ${sourceControlX} ${controlY}, ${targetControlX} ${controlY}, ${targetX} ${targetY}`
  )

  path.setAttribute('style', `stroke: ${color};`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }
}
