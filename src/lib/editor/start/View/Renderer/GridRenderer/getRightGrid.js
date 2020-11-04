import getRightSpanElement from '../../../getRightSpanElement'

export default function (editorDom, spanId) {
  const rightSpan = getRightSpanElement(editorDom, spanId)

  if (rightSpan) {
    return document.querySelector(`#G${rightSpan.id}`)
  }

  return null
}
