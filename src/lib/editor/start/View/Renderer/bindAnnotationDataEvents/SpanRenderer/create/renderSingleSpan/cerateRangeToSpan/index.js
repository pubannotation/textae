import getRenderingPosition from './getRenderingPosition'
import validateRenderingPosition from './validateRenderingPosition'
import createRange from './createRange'

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
export default function(editor, span) {
  const { textNode, start, end } = getRenderingPosition(editor, span)

  if (!textNode) {
    throw new Error(`The textNode on to create a span is not found. ${span.id}`)
  }

  if (!validateRenderingPosition(textNode, start, end)) {
    throw new Error(
      `oh my god! I cannot render ${span.id}. textNode ${textNode.textContent}. at ${start} : ${end}`
    )
  }

  return createRange(textNode, start, end)
}
