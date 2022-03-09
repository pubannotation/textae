export default function (path, curveAlgorithm, color, isBold) {
  path.setAttribute('d', curveAlgorithm.pathCommands)

  path.setAttribute('style', `stroke: ${color};`)

  if (isBold) {
    path.classList.add('textae-editor__relation--isBold')
  } else {
    path.classList.remove('textae-editor__relation--isBold')
  }
}
