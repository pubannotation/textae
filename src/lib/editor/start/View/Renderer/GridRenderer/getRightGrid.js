import getRightSpanElement from '../../../getRightSpanElement'

export default function (editor, spanId) {
  const rightSpan = getRightSpanElement(editor, spanId)

  if (rightSpan) {
    return document.querySelector(`#G${rightSpan.id}`)
  }

  return null
}
