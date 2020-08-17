import { getRightElement } from '../../../getNextElement'

export default function(editorDom, spanId) {
  const rightSpan = getRightElement(
    editorDom,
    document.querySelector(`#${spanId}`),
    'textae-editor__span'
  )

  if (!rightSpan) {
    return [null, null]
  }

  const grid = document.querySelector(`#G${rightSpan.id}`)
  if (grid) {
    return [rightSpan, grid]
  }

  return [rightSpan, null]
}
