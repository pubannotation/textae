export default function (path, pathPoints, color, isBold) {
  path.setAttribute('d', pathPoints.pathCommands)

  path.setAttribute('style', `stroke: ${color};`)

  if (isBold && !pathPoints.isCalm) {
    path.classList.add('textae-editor__relation--isBold')
  } else {
    path.classList.remove('textae-editor__relation--isBold')
  }
}
