import { NS } from '../../NS'

export default function () {
  const path = document.createElementNS(NS.SVG, 'path')
  path.classList.add('textae-editor__relation')
  return path
}
