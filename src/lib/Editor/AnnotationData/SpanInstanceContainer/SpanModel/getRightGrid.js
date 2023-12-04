import getRightSpanElement from '../../../getRightSpanElement'

export default function (editorHTMLElement, spanId) {
  const rightSpan = getRightSpanElement(editorHTMLElement, spanId)

  if (rightSpan) {
    return document.querySelector(`#G${rightSpan.id}`)
  }

  return null
}
