import getRightSpanElement from '../../../getRightSpanElement'

export default function(editorDom, spanId) {
  const rightSpan = getRightSpanElement(editorDom, spanId)

  if (!rightSpan) {
    return [null, null]
  }

  const grid = document.querySelector(`#G${rightSpan.id}`)
  if (grid) {
    return [rightSpan, grid]
  }

  return [rightSpan, null]
}
