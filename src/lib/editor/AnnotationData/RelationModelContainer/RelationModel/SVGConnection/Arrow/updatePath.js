export default function (path, pathPoints, color, isBold) {
  path.setAttribute('d', pathPoints.d)

  path.setAttribute('style', `stroke: ${color};`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  }
}
